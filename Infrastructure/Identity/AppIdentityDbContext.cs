using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Core.Entities.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContext : IdentityDbContext<AppUser>
    {
        public AppIdentityDbContext(DbContextOptions<AppIdentityDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            /*builder.Entity<AppUser>(b =>
            {
                b.ToTable("AppUsers");
            });

            builder.Entity<IdentityRole>(b =>
            {
                b.ToTable("AppRoles");
            });

            builder.Entity<IdentityUserRole<string>>(b =>
            {
                b.ToTable("AppUserRoles");
            });

            builder.Entity<IdentityUserClaim<string>>(b =>
            {
                b.ToTable("AppUserClaims");
            });

            builder.Entity<IdentityUserLogin<string>>(b =>
            {
                b.ToTable("AppUserLogins");
            });

            builder.Entity<IdentityRoleClaim<string>>(b =>
            {
                b.ToTable("AppRoleClaims");
            });

            builder.Entity<IdentityUserToken<string>>(b =>
            {
                b.ToTable("AppUserTokens");
            });*/
        }
    }
}