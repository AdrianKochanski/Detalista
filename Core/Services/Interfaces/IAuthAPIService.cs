
using Core.Models.Identity.Dtos;

namespace Core.Services.Interfaces
{
    public interface IAuthAPIService
    {
        public Task<UserWithTokenDto> LoginAsync(LoginDto loginDto);
    }
}