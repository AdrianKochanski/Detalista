using Core.Entities;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Core.Interfaces
{
    public interface IGenericRepositoryFactory
    {
        public IGenericRepository<T> Create<T>() where T : BaseEntity;

    }
}
