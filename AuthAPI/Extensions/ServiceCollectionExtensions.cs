namespace AuthAPI.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddAutoMapper(typeof(MappingProfiles));
            
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
                });
            });
            
            services.Configure<JwtOptions>(config.GetSection("Token"));
            services.AddScoped<ITokenProvider, TokenProvider>();

            services.AddDbContext<AppIdentityDbContext>(x =>
                x.UseNpgsql(config.GetConnectionString("IdentityConnection")));

            var builder = services.AddIdentityCore<AppUser>();
            builder = new IdentityBuilder(builder.UserType, typeof(IdentityRole), services);
            builder.AddEntityFrameworkStores<AppIdentityDbContext>();
            builder.AddSignInManager<SignInManager<AppUser>>();
            builder.AddRoles<IdentityRole>();
            builder.AddRoleManager<RoleManager<IdentityRole>>();

            return services;
        }
    }
}