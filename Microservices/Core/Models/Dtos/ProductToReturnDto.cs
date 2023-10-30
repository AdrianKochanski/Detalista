namespace Core.Models.Dtos
{
    public class ProductToReturnDto : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string PictureUrl { get; set; }
        public string ProductType { get; set; }
        public string ProductBrand { get; set; }
        public int Stock { get; set; }
        public int Rating { get; set; }
        public bool IsCrypto { get; set; }
    }
}