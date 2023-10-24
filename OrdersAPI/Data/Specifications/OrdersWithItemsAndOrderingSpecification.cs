namespace OrdersAPI.Data.Specifications
{
    public class OrdersWithItemsAndOrderingSpecification : BaseSpecifcation<Order>
    {
        public OrdersWithItemsAndOrderingSpecification(string email) 
            : base(o => o.BuyerEmail == email)
        {
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.DeliveryMethod);
            AddOrderByDescending(o => o.OrderDate);
        }

        public OrdersWithItemsAndOrderingSpecification(int id, string email) 
            : base(o => o.Id ==id && o.BuyerEmail == email)
        {
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.DeliveryMethod);
        }
    }
}