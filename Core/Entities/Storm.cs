namespace Core.Entities
{
    public class Storm : BaseEntity
    {
        public required string ParentId { get; set; }
        public required string Text { get; set; }
        public ICollection<Storm> Storms { get; set; } = new List<Storm>();
    }
}