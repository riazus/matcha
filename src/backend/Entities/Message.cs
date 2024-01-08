namespace Backend.Entities;

public class Message
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SenderId { get; set; }
    public Guid ChatId { get; set; }
    public string Text { get; set; }
    public DateTime Date { get; set; }
}
