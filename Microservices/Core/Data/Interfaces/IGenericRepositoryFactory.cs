using Core.Models;

namespace Core.Data.Interfaces
{
    public interface IGenericRepositoryFactory
    {
        public IGenericRepository<T> Create<T>() where T : BaseEntity;
    }
}