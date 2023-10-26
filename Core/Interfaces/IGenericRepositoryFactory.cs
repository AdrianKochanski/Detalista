using Core.Models;

namespace Core.Interfaces
{
    public interface IGenericRepositoryFactory
    {
        public IGenericRepository<T> Create<T>() where T : BaseEntity;
    }
}