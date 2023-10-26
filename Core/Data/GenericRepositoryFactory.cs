using Core.Models;
using Core.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Data
{
    public class GenericRepositoryFactory<C> : IGenericRepositoryFactory where C: DbContext
    {
        private readonly C _context;
        
        public GenericRepositoryFactory(C context)
        {
            _context = context;
        }

        public IGenericRepository<T> Create<T>() where T : BaseEntity
        {
            return new GenericRepository<C, T>(_context);
        }
    }
}