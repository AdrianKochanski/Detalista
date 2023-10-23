namespace ProductsAPI.Data
{
    public class ProductsContextSeed
    {
        private static DataSeed GetDataSeed() {
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var dataSeedFile = File.ReadAllText(path + @"/Data/SeedData/seedData.json");
            return JsonSerializer.Deserialize<DataSeed>(
                dataSeedFile, 
                new JsonSerializerOptions() {
                    PropertyNameCaseInsensitive = true
                }
            );
        }

        public static async Task SeedAsync(ProductsContext context, ILoggerFactory loggerFactory)
        {
            try
            {
                var dataSeed = GetDataSeed();
                var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

                if (!context.ProductBrands.Any())
                {
                    context.ProductBrands.AddRange(dataSeed.Brands);
                }

                if (!context.ProductTypes.Any())
                {
                    context.ProductTypes.AddRange(dataSeed.Types);
                }

                if (!context.Products.Any())
                {
                    List<Product> newProducts = new List<Product>();
                    foreach (var item in dataSeed.Products)
                    {
                        newProducts.Add(new Product() {
                            Id = item.Id,
                            Description = item.Description,
                            Name = item.Name,
                            PictureUrl = item.PictureUrl,
                            Price = item.Price,
                            ProductBrandId = item.ProductBrandId,
                            ProductTypeId = item.ProductTypeId,
                            Rating = item.Rating,
                            Stock = item.Stock
                        });
                    }
                    context.Products.AddRange(newProducts);
                }

                if (!context.DeliveryMethods.Any())
                {
                    var deliveryData = File.ReadAllText(path + @"/Data/SeedData/delivery.json");
                    var deliveryMethods = JsonSerializer.Deserialize<List<DeliveryMethod>>(deliveryData);
                    context.DeliveryMethods.AddRange(deliveryMethods);
                }

                if(context.ChangeTracker.HasChanges()) {
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<ProductsContextSeed>();
                logger.LogError(ex.Message);
            }
        }
    }
}
