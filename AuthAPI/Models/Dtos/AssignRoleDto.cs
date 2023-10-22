using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AuthAPI.Models.Dtos
{
    public class UpdateRoleDto
    {
        public string Email { get; set; }
        public string Role { get; set; }
    }
}