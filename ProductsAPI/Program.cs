var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddApiModelStateValidation();
builder.Services.AddSwaggerDocumentation();

// Configure http request pipeline
var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.UseSwaggerDocumentation(builder.Environment.IsDevelopment());
app.UseStatusCodePagesWithReExecute("/errors/{0}");
app.UseHttpsRedirection();

app.UseCors("CorsPolicy");
app.MapControllers();

// On app start
await app.UpdateMigrations<Program, ProductsContext>(
    builder.Environment.IsDevelopment(), 
    ProductsContextSeed.SeedAsync
);
await app.RunAsync();