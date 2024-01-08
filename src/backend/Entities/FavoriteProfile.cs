namespace Backend.Entities;

public class FavoriteProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid LikedById { get; set; }
    public Guid FavoriteAccountId { get; set; }
}
