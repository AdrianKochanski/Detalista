namespace OrdersAPI.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _uow;
        private readonly IBasketAPIService _basketAPIService;
        private readonly IProductsAPIService _productsAPIService;

        public OrderService(IUnitOfWork unitOfWork, IBasketAPIService basketAPIService, IProductsAPIService productsAPIService) {
            _uow = unitOfWork;
            _basketAPIService = basketAPIService;
            _productsAPIService = productsAPIService;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            // Basket Service
            var basket = await _basketAPIService.GetBasketAsync(basketId);
            var items = new List<OrderItem>();

            foreach(var item in basket.Items)
            {
                var productItem = await _productsAPIService.GetProduct(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }

            var deliveryMethod = await GetDeliveryMethodByIdAsync(deliveryMethodId);
            var subtotal = items.Sum(i => i.Price * i.Quantity);

            OrderByPaymentIntentIdSpecification intentSpec = new OrderByPaymentIntentIdSpecification(basket.PaymentIntentId);
            Order order = await _uow.Repository<Order>().GetEntityWithSpec(intentSpec);

            if(order != null) 
            {
                order.ShipToAddress = shippingAddress;
                order.DeliveryMethod = deliveryMethod;
                order.Subtotal = subtotal;
                _uow.Repository<Order>().Update(order);
            }
            else
            {
                order = new Order(buyerEmail, shippingAddress, deliveryMethod, items, subtotal, basket.PaymentIntentId);
                _uow.Repository<Order>().Add(order);
            }

            var result = await _uow.Complete();

            if(result <= 0) 
            {
                return null;
            }

            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _uow.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<DeliveryMethod> GetDeliveryMethodByIdAsync(int id)
        {
            return await _uow.Repository<DeliveryMethod>().GetByIdAsync(id);
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);
            return await _uow.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
            return await _uow.Repository<Order>().ListAsync(spec);
        }

        public async Task<Order> UpdateOrderPaymentStatus(string paymentIntentId, OrderStatus newPaymentStatus)
        {
            var spec = new OrderByPaymentIntentIdSpecification(paymentIntentId);
            Order order = await _uow.Repository<Order>().GetEntityWithSpec(spec);

            if(order == null)
            {
                return null;
            }

            order.Status = newPaymentStatus;
            await _uow.Complete();

            return order;
        }
    }
}