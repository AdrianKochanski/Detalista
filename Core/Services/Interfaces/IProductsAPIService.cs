using Core.Models.Dtos;

namespace Core.Services.Interfaces
{
    public interface IProductsAPIService
    {
        public Task<ProductToReturnDto> GetProduct(int id);
    }
}