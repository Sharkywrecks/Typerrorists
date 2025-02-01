using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.Identity
{
    public class Address
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string SubDistrict { get; set; }
        public string District { get; set; }
        public string Island { get; set; }
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }

    }
}