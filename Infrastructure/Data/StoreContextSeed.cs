using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Logging;
using Nethereum.Web3;
using Microsoft.Extensions.Configuration;
using Core.Entities.Crypto;
using Nethereum.Contracts.ContractHandlers;
using Core.Helpers;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static async Task CryptoSeedAsync(IConfiguration config, ILoggerFactory loggerFactory) {
            var connector = await CryptoConnector.GetContractHandler(config);

            if(connector.Item1 != null && connector.Item2 == null) {
                bool deploySuccess = await DeployContract(connector.Item1, loggerFactory);
                connector = await CryptoConnector.GetContractHandler(config);
                
                if(deploySuccess) {
                    await CryptoSeedProducts(
                        connector.Item2, 
                        loggerFactory
                    );
                }
            }
        }

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

        private static async Task CryptoSeedProducts(ContractHandler contractHandler, ILoggerFactory loggerFactory)
        {
            try
            {
                var dataSeed = GetDataSeed();

                List<Brand> brands = new List<Brand>();
                foreach(var brand in dataSeed.Brands) {
                    brands.Add(new Brand() {
                        Id = brand.Id,
                        Name = brand.Name
                    });
                }
                var updateBrandsFunction = new UpdateBrandsFunction();
                updateBrandsFunction.Brands = brands;
                var updateBrandsFunctionTxnReceipt = await contractHandler.SendRequestAndWaitForReceiptAsync(updateBrandsFunction);


                List<Category> types = new List<Category>();
                foreach(var type in dataSeed.Types) {
                    types.Add(new Category() {
                        Id = type.Id,
                        Name = type.Name
                    });
                }
                var updateCategoriesFunction = new UpdateCategoriesFunction();
                updateCategoriesFunction.Category = types;
                var updateCategoriesFunctionTxnReceipt = await contractHandler.SendRequestAndWaitForReceiptAsync(updateCategoriesFunction);


                List<NewItem> items = new List<NewItem>();
                foreach(var item in dataSeed.Products) {
                    items.Add(new NewItem() {
                        Id = item.Id,
                        Name = item.Name,
                        BrandId = item.ProductBrandId,
                        CategoryId = item.ProductTypeId,
                        Cost = Web3.Convert.ToWei(item.Eth.Replace('.', ',')),
                        Description = item.Description,
                        Image = item.Ipfs,
                        Rating = item.Rating,
                        Stock = item.Stock
                    });
                }
                var listItemsFunction = new ListItemsFunction();
                listItemsFunction.Items = items;
                var listItemsFunctionTxnReceipt = await contractHandler.SendRequestAndWaitForReceiptAsync(listItemsFunction);
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);
            }
        }

        private static async Task<bool> DeployContract(Web3 web3, ILoggerFactory loggerFactory) {
            try
            {
                var dappazonDeployment = new DappazonDeployment();

                var transactionReceiptDeployment = await web3.Eth
                    .GetContractDeploymentHandler<DappazonDeployment>()
                    .SendRequestAndWaitForReceiptAsync(dappazonDeployment);

                return true;
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);
                return false;
            }
        }

        public static async Task SeedAsync(StoreContext context, ILoggerFactory loggerFactory)
        {
            try
            {
                var dataSeed = GetDataSeed();
                var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

                if (!context.ProductBrands.Any())
                {
                    foreach (var item in dataSeed.Brands)
                    {
                        context.ProductBrands.Add(item);
                    }

                    await context.SaveChangesAsync();
                }

                if (!context.ProductTypes.Any())
                {
                    foreach (var item in dataSeed.Types)
                    {
                        context.ProductTypes.Add(item);
                    }

                    await context.SaveChangesAsync();
                }

                if (!context.Products.Any())
                {
                    foreach (var item in dataSeed.Products)
                    {
                        context.Products.Add(new Product() {
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

                    await context.SaveChangesAsync();
                }

                if (!context.DeliveryMethods.Any())
                {
                    var deliveryData = File.ReadAllText(path + @"/Data/SeedData/delivery.json");
                    var deliveryMethods = JsonSerializer.Deserialize<List<DeliveryMethod>>(deliveryData);

                    foreach (var item in deliveryMethods)
                    {
                        context.DeliveryMethods.Add(item);
                    }

                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);
            }
        }
    }
}
