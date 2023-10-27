WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddControllers();

builder.Services.AddAutoMapper(typeof(MappingProfiles));
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Token"));
builder.Services.AddScoped<ITokenProvider, TokenProvider>();
builder.Services.AddDbContext<AppIdentityDbContext>(x => x.UseNpgsql(builder.Configuration.GetConnectionString("IdentityConnection")));

var identityBuilder = builder.Services.AddIdentityCore<AppUser>();
identityBuilder = new IdentityBuilder(identityBuilder.UserType, typeof(IdentityRole), builder.Services);
identityBuilder.AddEntityFrameworkStores<AppIdentityDbContext>();
identityBuilder.AddSignInManager<SignInManager<AppUser>>();
identityBuilder.AddRoles<IdentityRole>();
identityBuilder.AddRoleManager<RoleManager<IdentityRole>>();

builder.Services.AddCorsWithOrigin("CorsPolicy", "https://localhost:4200");
builder.Services.AddExceptionHandling();
builder.Services.AddAuthentication(builder.Configuration);
builder.Services.AddSwaggerDocumentation("AuthAPI", true);

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