namespace Backend.Entities;

public class ProfileView
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ViewedById { get; set; }
    public Guid AccountId { get; set; }
    public DateTime Date { get; set; }
}
