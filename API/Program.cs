using Core.Entities.Identity;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddAutoMapper(typeof(MappingProfiles));
builder.Services.AddControllers();

builder.Services.AddSingleton<IConnectionMultiplexer>(c => {
    return ConnectionMultiplexer.Connect(
        ConfigurationOptions.Parse(
            builder.Configuration.GetConnectionString("Redis"),
            true
        )
    );
});

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddSwaggerDocumentation();
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
    });
});


// Configure http request pipeline
var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();

app.UseSwaggerDocumentation();

app.UseStatusCodePagesWithReExecute("/errors/{0}");

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions() {
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Content")
    ),
    RequestPath = "/Content"
});

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToController("Index", "Fallback");


// On app start
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var loggerFactory = services.GetRequiredService<ILoggerFactory>();
try
{
    var context = services.GetRequiredService<StoreContext>();
    await context.Database.MigrateAsync();

    var config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.Development.json", optional: false)
        .Build();

    await StoreContextSeed.SeedAsync(context, loggerFactory);
    await StoreContextSeed.CryptoSeedAsync(config, loggerFactory);

    UserManager<AppUser> userManager = services.GetRequiredService<UserManager<AppUser>>();
    AppIdentityDbContext identityContext = services.GetRequiredService<AppIdentityDbContext>();
    await identityContext.Database.MigrateAsync();
    await AppIdentityDbContextSeed.SeedUsersAsync(userManager);
}
catch (Exception ex)
{
    var logger = loggerFactory.CreateLogger<Program>();
    logger.LogError(ex, "An error occurred during migration");
}

await app.RunAsync();