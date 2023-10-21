namespace AuthAPI.Authentication
{
    public interface ITokenProvider
    {
        string CreateToken(AppUser user, IEnumerable<string> roles);
    }
}