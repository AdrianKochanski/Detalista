using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
    public class BaseEntity
    {
        [Required]
        public int Id { get; set; }
    }
}