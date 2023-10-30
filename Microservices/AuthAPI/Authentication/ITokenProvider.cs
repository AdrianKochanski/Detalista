namespace AuthAPI.Authentication
{
    public interface ITokenProvider
    {
        Task<string> CreateToken(AppUser user);
    }
}