namespace Backend.Entities;
public class Chat
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid FirstAccountId { get; set; }
    public Guid SecondAccountId { get; set; }
}
