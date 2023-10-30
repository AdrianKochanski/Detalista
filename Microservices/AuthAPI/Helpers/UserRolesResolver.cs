namespace AuthAPI.Helpers
{
    public class UserRolesResolver : IValueResolver<AppUser, UserWithRolesDto, string[]>
    {
        private readonly UserManager<AppUser> _userManager;
        
        public UserRolesResolver(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        public string[] Resolve(AppUser source, UserWithRolesDto destination, string[] destMember, ResolutionContext context)
        {
            return _userManager.GetRolesAsync(source).Result.ToArray();
        }
    }
}