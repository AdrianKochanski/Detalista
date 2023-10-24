WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddApiModelStateValidation();
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
await app.UpdateMigrations<Program, AppIdentityDbContext>(
    builder.Environment.IsDevelopment(), 
    AppIdentityDbContextSeed.SeedUserWithRoleAsync
);
await app.RunAsync();