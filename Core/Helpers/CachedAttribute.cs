using System.Text;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace Core.Helpers
{
    public class CachedAttribute : Attribute, IAsyncActionFilter
    {
        private readonly int _timeToLiveInSeconds;

        public CachedAttribute(int timeToLiveInSeconds) {
            _timeToLiveInSeconds = timeToLiveInSeconds;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var cacheService = context.HttpContext.RequestServices.GetService<IResponseCacheService>();

            string cachedKey = GenerateCacheKeyFromRequest(context.HttpContext.Request);
            string cachedResponse = await cacheService.GetCachedResponseAsync(cachedKey);

            if(!string.IsNullOrWhiteSpace(cachedResponse)) {
                var contentResult = new ContentResult(){
                    Content = cachedResponse,
                    ContentType = "application/json",
                    StatusCode = 200
                };

                context.Result = contentResult;

                return;
            }

            ActionExecutedContext executedContext = await next(); // move to controller

            if(executedContext.Result is OkObjectResult okObjectResult) {
                await cacheService.CacheResponseAsync(
                    cachedKey, 
                    okObjectResult.Value, 
                    TimeSpan.FromSeconds(_timeToLiveInSeconds)
                );
            }
        }

        private string GenerateCacheKeyFromRequest(HttpRequest request)
        {
            StringBuilder keyBuilder = new StringBuilder();

            keyBuilder.Append($"{request.Path}");

            foreach(var (key, value) in request.Query.OrderBy(p => p.Key)) {
                keyBuilder.Append($"|{key}-{value}");
            }

            return keyBuilder.ToString();
        }
    }
}