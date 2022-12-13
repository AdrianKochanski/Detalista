using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specification
{
    public class ProductsWithFilterForCountSpecification : BaseSpecification<Product>
    {
        public ProductsWithFilterForCountSpecification(ProductSpecParams productSpecParams)
            : base(x => 
                (string.IsNullOrWhiteSpace(productSpecParams.Search) || x.Name.ToLower().Contains(productSpecParams.Search)) &&
                (!productSpecParams.BrandId.HasValue || x.ProductBrandId == productSpecParams.BrandId) &&
                (!productSpecParams.TypeId.HasValue || x.ProductBrandId == productSpecParams.TypeId)
            )
        {
        }
    }
}