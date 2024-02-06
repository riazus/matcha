namespace Backend.Entities;

public class ScheduleEvent
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SenderId { get; set; }
    public Guid ReceiverId { get; set; }
    public DateTime Created { get; set; } = DateTime.Now;
    public DateTime EventDate { get; set; }
    public string Description { get; set; }
    public string EventName { get; set; }
}
