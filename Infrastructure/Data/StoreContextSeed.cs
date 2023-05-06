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
                string contractAddress = await DeployContract(connector.Item1, loggerFactory);
                connector = await CryptoConnector.GetContractHandler(config, contractAddress);
                
                if(!string.IsNullOrWhiteSpace(contractAddress)) {
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
                Console.WriteLine("Brands seed at: " + contractHandler.ContractAddress);


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
                Console.WriteLine("Categories seed at: " + contractHandler.ContractAddress);


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

                int batchSize = 5;
                for(int i=0; i <= items.Count / batchSize; i++) 
                {
                    var listItemsFunction = new ListItemsFunction();
                    listItemsFunction.Items = items.Skip(batchSize * i).Take(batchSize).ToList();

                    if(listItemsFunction.Items.Count > 0) {
                        var listItemsFunctionTxnReceipt = await contractHandler.SendRequestAndWaitForReceiptAsync(listItemsFunction);
                        Console.WriteLine($"Products count { i * batchSize + listItemsFunction.Items.Count} seed at: {contractHandler.ContractAddress}");
                    }
                }
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);
            }
        }

        private static async Task<string> DeployContract(Web3 web3, ILoggerFactory loggerFactory) {
            try
            {
                var dappazonDeployment = new DappazonDeployment();

                var transactionReceiptDeployment = await web3.Eth
                    .GetContractDeploymentHandler<DappazonDeployment>()
                    .SendRequestAndWaitForReceiptAsync(dappazonDeployment);

                Console.WriteLine("Contract deployed at: " + transactionReceiptDeployment.ContractAddress);
                return transactionReceiptDeployment.ContractAddress;
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);
                return "";
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
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);
            }
        }
    }
}
