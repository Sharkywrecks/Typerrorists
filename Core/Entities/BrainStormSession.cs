namespace Core.Entities
{
    public class BrainStormSession : BaseEntity
    {
        public required string UserId { get; set; }
        public required string ParentId { get; set; }
        public required string SessionName { get; set; }
        // Navigation properties for one-to-many relationships
        public ICollection<Storm> Storms { get; set; } = new List<Storm>();
    }
}