var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddControllers();

builder.Services.AddAutoMapper(typeof(MappingProfiles));
builder.Services.AddDbContext<ProductsContext>(x => x.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddDbContext<DbContext>(x => x.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork<ProductsContext>>();
builder.Services.AddScoped<IGenericRepositoryFactory, GenericRepositoryFactory<ProductsContext>>();

builder.Services.AddCorsWithOrigin("CorsPolicy", "https://localhost:4200");
builder.Services.ConnectToRedis(builder.Configuration.GetConnectionString("Redis")).WithRedisCache();
builder.Services.AddExceptionHandling();
builder.Services.AddSwaggerDocumentation();

// Configure http request pipeline
var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.UseSwaggerDocumentation(builder.Environment.IsDevelopment());
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
app.MapControllers();

// On app start
await app.UpdateMigrations<Program, ProductsContext>(
    builder.Environment.IsDevelopment(), 
    ProductsContextSeed.SeedAsync
);
await app.RunAsync();