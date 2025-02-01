using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            if (!roleManager.Roles.Any())
            {
                var roles = new [] {"Admin", "User"};
                
                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role)) {
                        await roleManager.CreateAsync(new IdentityRole(role));
                    }
                }
            }
        }

        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            var user = new AppUser
                {
                    Id = "1",
                    DisplayName = "WinnerWinner",
                    Email = "bob@test.com",
                };
            
            if (await userManager.FindByEmailAsync(user.Email) is null)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRolesAsync(user, new [] {"User"});
            }
        }
    }
}