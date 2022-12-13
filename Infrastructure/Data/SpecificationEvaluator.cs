using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specification;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class SpecificationEvaluator<TEntity> where TEntity: BaseEntity
    {
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec) 
        {
            if(spec.Criteria != null)
            {
                inputQuery.Where(spec.Criteria);
            }

            if(spec.OrderBy != null)
            {
                inputQuery.OrderBy(spec.OrderBy);
            }

            if(spec.OrderByDescending != null)
            {
                inputQuery.OrderBy(spec.OrderByDescending);
            }

            if(spec.IsPagingEnabled)
            {
                inputQuery.Skip(spec.Skip).Take(spec.Take);
            }

            inputQuery = spec.Includes.Aggregate(inputQuery, (current, include) => current.Include(include));
            
            return inputQuery;
        }
    }
}