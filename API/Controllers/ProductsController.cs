using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Core.Specification;
using API.Dtos;
using AutoMapper;
using API.Errors;
using Microsoft.AspNetCore.Http;
using API.Helpers;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<ProductBrand> _productBrandsRepo;
        private readonly IGenericRepository<ProductType> _productTypesRepo;
        private readonly IMapper _mapper;

        public ProductsController(
            IGenericRepository<Product> productsRepo,
            IGenericRepository<ProductBrand> productBrandsRepo,
            IGenericRepository<ProductType> productTypesRepo,
            IMapper mapper
        )
        {
            _productsRepo = productsRepo;
            _productBrandsRepo = productBrandsRepo;
            _productTypesRepo = productTypesRepo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts([FromQuery]ProductSpecParams productSpecParams)
        {
            IReadOnlyList<Product> products = await _productsRepo.ListAsync(new ProductsWithTypesAndBrandsSpecification(productSpecParams));
            IReadOnlyList<ProductToReturnDto> data = _mapper.Map<IReadOnlyList<ProductToReturnDto>>(products);

            return Ok(new Pagination<ProductToReturnDto>(
                productSpecParams.PageIndex,
                productSpecParams.PageSize,
                await _productsRepo.CountAsync(new ProductsWithFilterForCountSpecification(productSpecParams)),
                data
            ));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            Product product = await _productsRepo.GetEntityWithSpec(new ProductsWithTypesAndBrandsSpecification(id));

            if(product == null) return NotFound(new ApiResponse(404));

            return Ok(_mapper.Map<ProductToReturnDto>(product));
        }

        [HttpGet("{brands}")]
        public async Task<ActionResult<List<ProductBrand>>> GetProductBrands()
        {
            var productsBrands = await _productBrandsRepo.ListAllAsync();
            return Ok(productsBrands);
        }

        [HttpGet("{types}")]
        public async Task<ActionResult<List<ProductType>>> GetProductTypes()
        {
            var productsTypes = await _productTypesRepo.ListAllAsync();
            return Ok(productsTypes);
        }
    }
}