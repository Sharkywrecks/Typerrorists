namespace Core.Entities
{
    public class StormChild : BaseEntity
    {
        public required string ParentId { get; set; }
        public required string ChildId { get; set; }
    }
}