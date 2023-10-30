namespace Core.Models.Seed
{
    public class ProductParams
    {
        public int Id {get; set;}
        public string Name {get; set;}
        public int ProductBrandId {get; set;}
        public int ProductTypeId {get; set;}
        public string PictureUrl {get; set;}
        public string Ipfs {get; set;}
        public string Description {get; set;}
        public decimal Price {get; set;}
        public string Eth {get; set;}
        public int Rating {get; set;}
        public int Stock {get; set;}
    }
}