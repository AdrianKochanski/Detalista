using System.Reflection;
using System.Text.Json;

namespace OrdersAPI.Data
{
    public class OrdersContextSeed
    {
        public static async Task SeedAsync(OrdersContext context, IServiceProvider services, bool isDevelopment, ILoggerFactory loggerFactory)
        {
            if (!isDevelopment) return;

            try
            {
                var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

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
                var logger = loggerFactory.CreateLogger<OrdersContextSeed>();
                logger.LogError(ex.Message);
            }
        }
    }
}
