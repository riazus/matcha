namespace Backend.Entities;

public class UnfavoriteProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid DislikedById { get; set; }
    public Guid UnfavoriteAccountId { get; set; }
}
