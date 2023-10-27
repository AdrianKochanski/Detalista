namespace Core.Models.Identity.Dtos
{
    public class UserWithRolesDto
    {
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string[] Roles { get; set; }
    }
}