namespace AuthAPI.Extensions
{
    public static class UserManagerExtensions
    {
        public static async Task<AppUser> FindByClaimsPrincipleWithAddressAsync(this UserManager<AppUser> input, ClaimsPrincipal user) 
        {
            var email = user.FindFirstValue(ClaimTypes.Email);
            return await input.Users.Include(x => x.Address).SingleOrDefaultAsync(x => x.Email == email);
        }

        public static async Task<AppUser> FindByClaimsPrincipleAsync(this UserManager<AppUser> input, ClaimsPrincipal user) 
        {
            var email = user.FindFirstValue(ClaimTypes.Email);
            return await input.Users.SingleOrDefaultAsync(x => x.Email == email);
        }

        public static async Task<IdentityResult> AddToRoleAsync(this UserManager<AppUser> input, AppUser user, Role role) 
        {
            return await input.AddToRoleAsync(user, role.Name());
        }

        public static string Name(this Role role) {
            return Enum.GetName(typeof(Role), role);
        }
    }
}