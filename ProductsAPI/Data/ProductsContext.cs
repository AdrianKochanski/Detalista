namespace Infrastructure.Data
{
    public class ProductsContext : ContextBase
    {
        public ProductsContext(DbContextOptions<DbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductBrand> ProductBrands { get; set; }
        public DbSet<ProductType> ProductTypes { get; set; }
        public DbSet<DeliveryMethod> DeliveryMethods {get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            SetAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
        }
    }
}