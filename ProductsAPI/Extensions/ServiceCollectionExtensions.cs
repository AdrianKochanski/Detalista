namespace ProductsAPI.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddAutoMapper(typeof(MappingProfiles));
            
            services.AddDbContext<ProductsContext>(x =>
                x.UseNpgsql(config.GetConnectionString("DefaultConnection")));

            services.AddDbContext<DbContext>(x =>
                x.UseNpgsql(config.GetConnectionString("DefaultConnection")));

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
                });
            });
            
            services.AddSingleton<IConnectionMultiplexer>(c => {
                return ConnectionMultiplexer.Connect(
                    ConfigurationOptions.Parse(
                        config.GetConnectionString("Redis"),
                        true
                    )
                );
            });

            services.AddSingleton<IResponseCacheService, ResponseCacheService>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork<ProductsContext>>();
            services.AddScoped<IGenericRepositoryFactory, GenericRepositoryFactory<ProductsContext>>();
            services.Configure<ApiBehaviorOptions>(options => 
            {
                options.InvalidModelStateResponseFactory = actionContext => 
                {
                    var errors = actionContext.ModelState
                        .Where(e => e.Value.Errors.Count > 0)
                        .SelectMany(x => x.Value.Errors)
                        .Select(x => x.ErrorMessage).ToArray();

                    var errorResponse = new ApiValidationErrorResponse
                    {
                        Errors = errors
                    };

                    return new BadRequestObjectResult(errorResponse);
                };
            });

            return services;
        }
    }
}