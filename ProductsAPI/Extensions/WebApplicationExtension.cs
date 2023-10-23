namespace ProductsAPI.Extensions
{
    public static class WebApplicationExtension
    {
        public static async Task SeedProductsAsync(this WebApplication app, bool isDevelopment) 
        {
            if(isDevelopment) {
                using var scope = app.Services.CreateScope();
                var services = scope.ServiceProvider;
                var loggerFactory = services.GetRequiredService<ILoggerFactory>();

                try
                {
                    var context = services.GetRequiredService<ProductsContext>();
                    await context.Database.MigrateAsync();
                    await ProductsContextSeed.SeedAsync(context, loggerFactory);
                }
                catch (Exception ex)
                {
                    var logger = loggerFactory.CreateLogger<Program>();
                    logger.LogError(ex, "An error occurred during migration");
                }
            }
        }
    }
}