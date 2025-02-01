using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
   public class BrainStormSessionConfiguration : IEntityTypeConfiguration<BrainStormSession>
    {
        public void Configure(EntityTypeBuilder<BrainStormSession> builder)
        {
            builder.Property(p => p.Id).HasColumnType("varchar(255)").IsRequired();
            builder.Property(p => p.SessionName).IsRequired();
            builder.Property(p => p.UserId).IsRequired().HasMaxLength(100);
            builder.Property(p => p.ParentId).IsRequired();

            // builder.HasOne(p => p.UserId)
            //        .WithMany()
            //        .HasForeignKey(p => p.UserId)
            //        .OnDelete(DeleteBehavior.Cascade);
        }
    }
}