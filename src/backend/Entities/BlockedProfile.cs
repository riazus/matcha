namespace Backend.Entities;

public class BlockedProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid BlockedAccountId  { get; set; }
    public Guid BlockedByAccountId { get; set; }
}
