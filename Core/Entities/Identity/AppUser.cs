using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        // TODO: Add user roles and phone number.
        // public ICollection<IdentityUserRole<string>> Roles { get; set; }
    }
}