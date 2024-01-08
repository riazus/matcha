namespace Backend.Repositories;

using Backend.Entities;
using MiniORM;

public interface INotificationRepository
{
    void Add(Notification notification);
    IEnumerable<Notification> GetNotifications(Guid currUserId);
    int GetNotificationCount(Guid currUserId);
    void Delete(Guid id);
}

public class NotificationRepository : INotificationRepository
{
    private readonly IDBContext _context;

    public NotificationRepository(IDBContext context)
    {
        _context = context;
    }

    public void Add(Notification notification)
    {
        _context.Insert(notification);
    }

    public IEnumerable<Notification> GetNotifications(Guid currUserId)
    {
        return _context.GetWhereList<Notification>($"AccountId = \'{currUserId}\' ORDER BY [Date] DESC");
    }

    public int GetNotificationCount(Guid currUserId)
    {
        return _context.GetWhereCount<Notification>($"AccountId = \'{currUserId}\'");
    }

    public void Delete(Guid id)
    {
        _context.Delete<Notification>(id);
    }
}
