using Core.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddControllers();

builder.Services.AddAutoMapper(typeof(MappingProfiles));
builder.Services.AddDbContext<OrdersContext>(x => x.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddDbContext<DbContext>(x => x.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork<OrdersContext>>();
builder.Services.AddScoped<IGenericRepositoryFactory, GenericRepositoryFactory<OrdersContext>>();

builder.Services.AddHttpApiClient<IBasketAPIService, BasketAPIService>(builder.Configuration);
builder.Services.AddHttpApiClient<IProductsAPIService, ProductsAPIService>(builder.Configuration);

builder.Services.AddCorsWithOrigin("CorsPolicy", builder.Configuration[$"ServiceUrls:ClientUrl"]);
builder.Services.ConnectToRedis(builder.Configuration.GetConnectionString("Redis")).WithRedisCache();
builder.Services.AddExceptionHandling();
builder.Services.AddAuthentication(builder.Configuration);
builder.Services.AddSwaggerDocumentation("OrdersAPI", true);

// Configure http request pipeline
var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.UseSwaggerDocumentation(builder.Environment.IsDevelopment());

app.UseStatusCodePagesWithReExecute("/errors/{0}");
app.UseHttpsRedirection();
app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// On app start
await app.UpdateMigrations<Program, OrdersContext>(
    builder.Environment.IsDevelopment(),
    OrdersContextSeed.SeedAsync
);
await app.RunAsync();