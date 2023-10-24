namespace OrdersAPI.Data.Config
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.OwnsOne(i => i.ItemOrdered, io => { io.WithOwner(); });
            builder.Property(i => i.Price)
                .HasColumnType("decimal(18,2)");
        }
    }
}