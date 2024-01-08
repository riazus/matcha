namespace Backend.Models.Notification;

using Backend.Entities;

public class NotificationsResponse
{
    public Guid Id { get; set; }
    public string Text { get; set; }
    public DateTime Date { get; set; }
    public bool IsViewed { get; set; }
    public NotificationType NotificationType { get; set; }
}
