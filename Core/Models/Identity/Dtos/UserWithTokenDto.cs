namespace Core.Models.Identity.Dtos
{
    public class UserWithTokenDto : UserWithRolesDto
    {
        public string Token { get; set; }
    }
}