namespace AuthAPI.Helpers
{
    public class UserJwtResolver : IValueResolver<AppUser, UserWithTokenDto, string>
    {
        private readonly ITokenProvider _tokenProvider;
        
        public UserJwtResolver(ITokenProvider tokenProvider)
        {
            _tokenProvider = tokenProvider;
        }

        public string Resolve(AppUser source, UserWithTokenDto destination, string destMember, ResolutionContext context)
        {
            return _tokenProvider.CreateToken(source).Result;
        }
    }
}