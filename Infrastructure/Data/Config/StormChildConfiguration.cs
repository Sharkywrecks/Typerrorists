using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
   public class StormChildConfiguration : IEntityTypeConfiguration<StormChild>
    {
        public void Configure(EntityTypeBuilder<StormChild> builder)
        {
            builder.Property(p => p.Id).HasColumnType("varchar(255)").IsRequired();;
            builder.Property(p => p.ParentId).IsRequired().HasMaxLength(100);
            builder.Property(p => p.ChildId).IsRequired();

            // builder.HasOne<Storm>()
            //        .WithMany()
            //        .HasForeignKey(p => p.ParentId)
            //        .OnDelete(DeleteBehavior.Cascade);
        }
    }
}