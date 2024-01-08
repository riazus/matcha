namespace Backend.Entities;

public class MatchedProfiles
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime Date { get; set; }
    public Guid Profile1 { get; set; }
    public Guid Profile2 { get; set; }
}
