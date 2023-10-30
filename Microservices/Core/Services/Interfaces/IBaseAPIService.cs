using Core.Models;
using Microsoft.Extensions.Logging;

namespace Core.Services.Interfaces
{
    public interface IBaseAPIService
    {
        public HttpClient CreateClient<T>();
        
        public Task<T> DeserializeResponse<T>(HttpResponseMessage response) where T: class;
    }
}