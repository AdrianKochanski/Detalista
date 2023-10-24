namespace OrdersAPI.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddAutoMapper(typeof(MappingProfiles));
            
            services.AddDbContext<OrdersContext>(x =>
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
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IUnitOfWork, UnitOfWork<OrdersContext>>();
            services.AddScoped<IGenericRepositoryFactory, GenericRepositoryFactory<OrdersContext>>();

            return services;
        }
    }
}