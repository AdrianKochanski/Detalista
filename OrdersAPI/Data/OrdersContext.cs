using System.Reflection;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace OrdersAPI.Data
{
    public class OrdersContext : ContextBase
    {
        public OrdersContext(DbContextOptions<DbContext> options) : base(options)
        {
        }

        public DbSet<Order> Orders {get; set;}
        public DbSet<OrderItem> OrderItems {get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            SetAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
        }
    }
}