var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddControllers();

builder.Services.AddHttpApiClient<IBasketAPIService, BasketAPIService>(builder.Configuration);
builder.Services.AddHttpApiClient<IProductsAPIService, ProductsAPIService>(builder.Configuration);
builder.Services.AddHttpApiClient<IOrdersAPIService, OrdersAPIService>(builder.Configuration);

builder.Services.AddCorsWithOrigin("CorsPolicy", builder.Configuration[$"ServiceUrls:ClientUrl"]);
builder.Services.ConnectToRedis(builder.Configuration.GetConnectionString("Redis")).WithRedisCache();
builder.Services.AddExceptionHandling();
builder.Services.AddAuthentication(builder.Configuration);
builder.Services.AddSwaggerDocumentation();

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
await app.RunAsync();