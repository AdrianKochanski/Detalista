namespace AuthAPI.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUserWithRoleAsync(AppIdentityDbContext context, IServiceProvider services, bool isDevelopment, ILoggerFactory loggerFactory)
        {
            if (!isDevelopment) return;
            
            RoleManager<IdentityRole> roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            await SeedRolesAsync(roleManager);

            UserManager<AppUser> userManager = services.GetRequiredService<UserManager<AppUser>>();
            await SeedUsersAsync(userManager);
        }

        private static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if(!userManager.Users.Any()){
                AppUser user = new AppUser{
                    DisplayName = "Bob",
                    Email = "bob@test.com",
                    UserName = "bob@test.com",
                    Address = new Address{
                        FirstName = "Bob",
                        LastName = "Bobbity",
                        Street = "10 The Street",
                        City = "New York",
                        State = "NY",
                        Zipcode = "90210"
                    }
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");

                foreach (Role role in Enum.GetValues(typeof(Role)))
                {
                    await userManager.AddToRoleAsync(user, role.Name());
                }
            }
        }

        private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            foreach (Role role in Enum.GetValues(typeof(Role)))
            {
                if (!await roleManager.RoleExistsAsync(role.Name()))
                {
                    await roleManager.CreateAsync(new IdentityRole(role.Name()));
                }
            }
        }
    }
}