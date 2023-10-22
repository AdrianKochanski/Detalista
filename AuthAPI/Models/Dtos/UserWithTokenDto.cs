namespace AuthAPI.Models.Dtos
{
    public class UserWithTokenDto : UserWithRolesDto
    {
        public string Token { get; set; }
    }
}