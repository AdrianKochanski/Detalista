using Core.Models.Basket;
using Core.Models.Basket.Dtos;

namespace Core.Services.Interfaces
{
    public interface IBasketAPIService
    {
        public Task<CustomerBasketDto> GetBasketAsync(string basketId);
        public Task<CustomerBasketDto> UpdateBasketAsync(CustomerBasketDto basket);
    }
}