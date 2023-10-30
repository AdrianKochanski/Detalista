namespace CryptoAPI.Controllers
{
    public class CryptoController : BaseApiController
    {
        private readonly IConfiguration _config;

        public CryptoController(IConfiguration config)
        {
            _config = config;
        }
        

        //[Cached(600)]
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts(
            [FromQuery]ProductSpecParams productParams)
        {
            await CryptoConnector.ContractInitialized(_config);

            var queryItemsFunction = new QueryItemsFunction(); 
            
            queryItemsFunction.Filter = new Filter() {
                BrandIdSelected = productParams.BrandId.HasValue ? productParams.BrandId.Value : 0,
                CategoryIdSelected = productParams.TypeId.HasValue ? productParams.TypeId.Value : 0,
                ItemsCount = 0,
                PageNumber = productParams.PageIndex > 0 ? productParams.PageIndex : 1,
                PageSize = productParams.PageSize > 0 ? productParams.PageSize : 6,
                Search = productParams.Search != null ? productParams.Search : "",
                SortSelected = productParams.Sort != null ? productParams.Sort : "name"
            };

            var queryItemsOutputDTO = await CryptoConnector.ContractHandler
                .QueryDeserializingToObjectAsync<QueryItemsFunction, QueryItemsOutputDTO>(
                    queryItemsFunction
                );
            
            List<ProductToReturnDto> products = new List<ProductToReturnDto>();
            foreach(var item in queryItemsOutputDTO.ItemsArray) {
                products.Add(new ProductToReturnDto() {
                    Id = (int)item.Id,
                    Description = item.Description,
                    Name = item.Name,
                    PictureUrl = item.Image,
                    Price = Web3.Convert.FromWei(item.Cost),
                    ProductBrand = item.Brand.Name,
                    ProductType = item.Category.Name,
                    Rating = (int)item.Rating,
                    Stock = (int)item.Stock,
                    IsCrypto = true
                });
            }

            return Ok(
                new Pagination<ProductToReturnDto>(
                    (int)queryItemsOutputDTO.FilterBack.PageNumber, 
                    (int)queryItemsOutputDTO.FilterBack.PageSize, 
                    (int)queryItemsOutputDTO.FilterBack.ItemsCount, 
                    products
                )
            );
        }

        //[Cached(600)]
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            await CryptoConnector.ContractInitialized(_config);

            var getItemFunction = new GetItemFunction();
            getItemFunction.ItemId = id;
            var getItemOutputDTO = await CryptoConnector.ContractHandler
                .QueryDeserializingToObjectAsync<GetItemFunction, GetItemOutputDTO>(getItemFunction);
            
            var item = getItemOutputDTO.ReturnValue1;

            return new ProductToReturnDto() {
                Id = (int)item.Id,
                Description = item.Description,
                Name = item.Name,
                PictureUrl = item.Image,
                Price = Web3.Convert.FromWei(item.Cost),
                ProductBrand = item.Brand.Name,
                ProductType = item.Category.Name,
                Rating = (int)item.Rating,
                Stock = (int)item.Stock,
                IsCrypto = true
            };
        }

        //[Cached(600)]
        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetBrands()
        {
            await CryptoConnector.ContractInitialized(_config);
            
            List<ProductBrand> brands = new List<ProductBrand>();

            var getLimitBrandsFunction = new GetLimitBrandsFunction(); 
            getLimitBrandsFunction.Limit = 10;
            var getLimitBrandsOutputDTO = await CryptoConnector.ContractHandler
            .QueryDeserializingToObjectAsync<GetLimitBrandsFunction, GetLimitBrandsOutputDTO>(getLimitBrandsFunction);

            foreach(var brand in getLimitBrandsOutputDTO.BrandsArray.Where(b => b.Id > 0)) {
                brands.Add(
                    new ProductBrand() {
                        Id = (int)brand.Id,
                        Name = brand.Name
                    }
                );
            }

            return Ok(brands);
        }

        //[Cached(600)]
        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetTypes()
        {
            await CryptoConnector.ContractInitialized(_config);

            List<ProductType> types = new List<ProductType>();
            
            var getLimitCategoriesFunction = new GetLimitCategoriesFunction(); 
            getLimitCategoriesFunction.Limit = 10;
            var getLimitCategoriesOutputDTO = await CryptoConnector.ContractHandler
            .QueryDeserializingToObjectAsync<GetLimitCategoriesFunction, GetLimitCategoriesOutputDTO>(getLimitCategoriesFunction);
            
            foreach(var type in getLimitCategoriesOutputDTO.CategoriesArray.Where(t => t.Id > 0)) {
                types.Add(
                    new ProductType() {
                        Id = (int)type.Id,
                        Name = type.Name
                    }
                );
            }

            return Ok(types);
        }
    }
}