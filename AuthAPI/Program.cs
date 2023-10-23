WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddAuthentication(builder.Configuration);
builder.Services.AddSwaggerDocumentation();

// Configure http request pipeline
var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseSwaggerDocumentation(builder.Environment.IsDevelopment());

app.UseStatusCodePagesWithReExecute("/errors/{0}");
app.UseHttpsRedirection();

// app.UseStaticFiles();
// app.UseStaticFiles(new StaticFileOptions() {
//     FileProvider = new PhysicalFileProvider(
//         Path.Combine(Directory.GetCurrentDirectory(), "Content")
//     ),
//     RequestPath = "/Content"
// });

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
//app.MapFallbackToController("Index", "Fallback");

// On app start
await app.SeedUserWithRole(builder.Environment.IsDevelopment());
await app.RunAsync();