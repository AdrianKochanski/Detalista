namespace OrdersAPI.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;

        public OrdersController(IOrderService orderService, IMapper mapper) 
        {
            _orderService = orderService;
            _mapper = mapper;
        }
        
        [HttpPost]
        public async Task<ActionResult<OrderToReturnDto>> CreateOrder(OrderDto orderDto)
        {
            string userEmail = User.FindFirstValue(ClaimTypes.Email);

            Order order = await _orderService.CreateOrderAsync(
                userEmail, 
                orderDto.DeliveryMethodId, 
                orderDto.BasketId, 
                _mapper.Map<Address>(orderDto.ShipToAddress)
            );

            if(order == null) 
            {
                return BadRequest(new ApiResponse(400, "Problem creating order"));
            }

            return Ok(_mapper.Map<OrderToReturnDto>(order));
        }

        [Authorize(Roles="OrderPaymentService")]
        [HttpPatch("updateOrderPaymentStatus/{paymentIntentId}")]
        public async Task<ActionResult<OrderToReturnDto>> UpdateOrderPaymentStatus(string paymentIntentId, [FromBody] OrderStatus newPaymentStatus)
        {
            Order order = await _orderService.UpdateOrderPaymentStatus(paymentIntentId, newPaymentStatus);
            return Ok(_mapper.Map<OrderToReturnDto>(order));
        }

        [Cached(600)]
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetOrdersForUser() 
        {
            string userEmail = User.FindFirstValue(ClaimTypes.Email);
            var orders = await _orderService.GetOrdersForUserAsync(userEmail);

            return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(orders));
        }

        [Cached(600)]
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderByIdForUser(int id) 
        {
            string userEmail = User.FindFirstValue(ClaimTypes.Email);
            var order = await _orderService.GetOrderByIdAsync(id, userEmail);

            if(order == null) 
            {
                return NotFound(new ApiResponse(404));
            }

            return Ok(_mapper.Map<OrderToReturnDto>(order));
        }
        
        [Cached(600)]
        [HttpGet("deliveryMethods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            return Ok(await _orderService.GetDeliveryMethodsAsync());
        }

        [Cached(600)]
        [HttpGet("deliveryMethod/{id}")]
        public async Task<ActionResult<DeliveryMethod>> GetDeliveryMethod(int id)
        {
            return Ok(await _orderService.GetDeliveryMethodByIdAsync(id));
        }
    }
}