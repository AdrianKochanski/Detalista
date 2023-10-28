namespace BasketAPI.Data
{
    public class BasketRepository : IBasketRepository
    {
        private readonly IDatabase _database;

        public BasketRepository(IConnectionMultiplexer redis) {
            _database = redis.GetDatabase();
        }

        public async Task<bool> DeleteBasketAsync(Guid basketId)
        {
            return await _database.KeyDeleteAsync(basketId.ToString());
        }

        public async Task<CustomerBasket> GetBasketAsync(Guid basketId)
        {
            var data = await _database.StringGetAsync(basketId.ToString());
            return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<CustomerBasket>(data);
        }

        public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
        {
            var created = await _database.StringSetAsync(
                basket.Id.ToString(), 
                JsonSerializer.Serialize(basket),
                TimeSpan.FromDays(30)
            );

            if(!created) return null;

            return await GetBasketAsync(basket.Id);
        }
    }
}