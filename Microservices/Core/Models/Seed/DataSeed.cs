namespace Core.Models.Seed
{
    public class DataSeed
    {
        public IEnumerable<ProductBrand> Brands { get; set; }
        public IEnumerable<ProductType> Types { get; set; }
        public IEnumerable<ProductParams> Products { get; set; }
    }
}