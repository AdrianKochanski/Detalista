using System.Text;
using Core.Models.Errors;
using Core.Interfaces;
using Core.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;

namespace Core.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddAuthentication(this IServiceCollection services, IConfiguration config)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = 
                    new TokenValidationParameters 
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                            config["Token:Key"]
                        )),
                        ValidIssuer = config["Token:Issuer"],
                        ValidateIssuer = true,
                        ValidAudience = config["Token:Audience"],
                        ValidateAudience = true
                    };
                });

            return services;
        }

        public static IServiceCollection ConnectToRedis(this IServiceCollection services, string connectionString)
        {
            services.AddSingleton<IConnectionMultiplexer>(c => {
                return ConnectionMultiplexer.Connect(
                    ConfigurationOptions.Parse(
                        connectionString,
                        true
                    )
                );
            });

            return services;
        }

        public static IServiceCollection WithRedisCache(this IServiceCollection services)
        {
            services.AddSingleton<IResponseCacheService, ResponseCacheService>();
            return services;
        }

        public static IServiceCollection AddCorsWithOrigin(this IServiceCollection services, string policyName, string origin)
        {
            services.AddCors(opt =>
            {
                opt.AddPolicy(policyName, policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins(origin);
                });
            });

            return services;
        }

        public static IServiceCollection AddExceptionHandling(this IServiceCollection services)
        {
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

        public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "AuthAPI", Version = "v1" });

                var securitySchema = new OpenApiSecurityScheme {
                    Description = "JWT Auth Bearer Scheme",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    Reference = new OpenApiReference{
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                };
                c.AddSecurityDefinition("Bearer", securitySchema);

                var securityRequirements = new OpenApiSecurityRequirement{{securitySchema, new [] {
                    "Bearer"
                }}};
                c.AddSecurityRequirement(securityRequirements);
            });

            return services;
        }

        public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app, bool isDevelopment)
        {
            if (isDevelopment)
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => {
                    c.RoutePrefix = string.Empty;
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "AuthAPI v1");
                });
            }

            return app;
        }

        public static async Task UpdateMigrations<P, C>(this WebApplication app, bool isDevelopment, Func<C, IServiceProvider, bool, ILoggerFactory, Task> migrationsAppliedCallback = null) where C : DbContext
        {
            using var scope = app.Services.CreateScope();
            IServiceProvider services = scope.ServiceProvider;
            var loggerFactory = services.GetRequiredService<ILoggerFactory>();

            try
            {
                var context = services.GetRequiredService<C>();
                await context.Database.MigrateAsync();
                if (migrationsAppliedCallback != null) {
                    await migrationsAppliedCallback(context, services, isDevelopment, loggerFactory);
                }
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<P>();
                logger.LogError(ex, "An error occurred during migration");
            }
        }
    }
}