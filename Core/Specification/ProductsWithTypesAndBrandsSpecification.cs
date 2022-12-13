using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specification
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {
        public ProductsWithTypesAndBrandsSpecification(ProductSpecParams productSpecParams)
            : base(x => 
                (string.IsNullOrWhiteSpace(productSpecParams.Search) || x.Name.ToLower().Contains(productSpecParams.Search)) &&
                (!productSpecParams.BrandId.HasValue || x.ProductBrandId == productSpecParams.BrandId) &&
                (!productSpecParams.TypeId.HasValue || x.ProductBrandId == productSpecParams.TypeId)
            )
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductType);
            AddOrderBy(x => x.Name);
            ApplyPaging(productSpecParams.PageSize * (productSpecParams.PageIndex - 1), productSpecParams.PageSize);

            if(!string.IsNullOrWhiteSpace(productSpecParams.Sort)) {
                switch(productSpecParams.Sort) {
                    case "priceAsc":
                        AddOrderBy(p => p.Price);
                        break;
                    case "priceDesc":
                        AddOrderByDescending(p => p.Price);
                        break;
                    default:
                        AddOrderBy(x => x.Name);
                        break;
                }
            }
        }

        public ProductsWithTypesAndBrandsSpecification(int id): base(x => x.Id == id) {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductType);
        }
    }
}