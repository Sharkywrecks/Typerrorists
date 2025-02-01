using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
   public class StormConfiguration : IEntityTypeConfiguration<Storm>
    {
        public void Configure(EntityTypeBuilder<Storm> builder)
        {
            builder.Property(p => p.Id).HasColumnType("varchar(255)").IsRequired();;
            builder.Property(p => p.ParentId).IsRequired().HasMaxLength(100);
            builder.Property(p => p.Text).IsRequired();

            // builder.HasOne(s => s.Id)
            //        .WithMany()
            //        .HasForeignKey(p => p.ParentId)
            //        .OnDelete(DeleteBehavior.Cascade);
        }
    }
}