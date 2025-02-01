using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class AddressDto
    {
        [Required]
        public required string FirstName { get; set; }
        [Required]
        public required string LastName { get; set; }
        [Required]
        public required string SubDistrict { get; set; }
        [Required]
        public required string District { get; set; }
        [Required]
        public required string Island { get; set; }
    }
}