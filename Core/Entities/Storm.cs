namespace Core.Entities
{
    public class Storm : BaseEntity
    {
        public required string ParentId { get; set; }
        public required string Text { get; set; }
    }
}