var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfiles));
builder.Services.AddScoped<IBasketRepository, BasketRepository>();
builder.Services.AddCorsWithOrigin("CorsPolicy", "https://localhost:4200");
builder.Services.ConnectToRedis(builder.Configuration.GetConnectionString("Redis"));
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

await app.RunAsync();