var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddControllers();
builder.Services.AddCorsWithOrigin("CorsPolicy", builder.Configuration[$"ServiceUrls:ClientUrl"]);
builder.Services.AddExceptionHandling();
builder.Services.AddSwaggerDocumentation("API");

// Configure http request pipeline
var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.UseSwaggerDocumentation(builder.Environment.IsDevelopment());
app.UseStatusCodePagesWithReExecute("/errors/{0}");
app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

// On app start
await app.RunAsync();