namespace Backend.Entities;

using MiniORM;

public class Notification
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AccountId { get; set; }
    public string Text { get; set; }
    public DateTime Date { get; set; }
    public bool IsViewed { get; set; } = false;
    public int NotificationTypeDB { get; set; }
    [Ignore]
    public NotificationType NotificationType 
    {
        get => (NotificationType)NotificationTypeDB;
        set => NotificationTypeDB = (int)value; 
    }
}

public enum NotificationType
{
    ProfileLiked = 0,
    ProfileViewed = 1,
    MessageReceived = 2,
    ProfileMatched = 3,
    ProfileUnliked = 4
}
