using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.Seed
{
    public class DataSeed
    {
        public IEnumerable<ProductBrand> Brands { get; set; }
        public IEnumerable<ProductType> Types { get; set; }
        public IEnumerable<ProductParams> Products { get; set; }
    }
}