namespace CryptoAPI.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static async Task UpdateCryptoContract(this WebApplication app, bool isDevelopment, Func<IConfiguration, bool, ILoggerFactory, Task> migrationsAppliedCallback = null)
        {
            using var scope = app.Services.CreateScope();
            var services = scope.ServiceProvider;
            var loggerFactory = services.GetRequiredService<ILoggerFactory>();
            try
            {
                var config = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.Development.json", optional: false)
                    .Build();

                await migrationsAppliedCallback(config, isDevelopment, loggerFactory);
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<Program>();
                logger.LogError(ex, "An error occurred during migration");
            }
        }
    }
}