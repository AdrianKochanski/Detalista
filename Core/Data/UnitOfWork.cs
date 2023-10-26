using System.Collections;
using Core.Models;
using Core.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Data
{
    public class UnitOfWork<T> : IUnitOfWork where T : DbContext
    {
        private readonly T _context;
        private Hashtable _repositories;

        public UnitOfWork(T context)
        {
            _context = context;
        }

        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            if(_repositories == null)
            {
                _repositories = new Hashtable();
            }

            string type = typeof(TEntity).Name;

            if(!_repositories.ContainsKey(type)) 
            {
                var repositoryType = typeof(GenericRepository<,>);
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(T), typeof(TEntity)), _context);
                _repositories.Add(type, repositoryInstance);
            }

            return (IGenericRepository<TEntity>) _repositories[type];
        }
    }
}