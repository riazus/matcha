namespace Backend.Services;

using Backend.Entities;
using Backend.Helpers;
using Backend.Models.Notification;
using Backend.Repositories;

public interface INotificationService
{
    Notification Add(string text, Guid accountId, DateTime date, NotificationType type);
    Notification AddProfileViewed(string username, Guid accountId);
    Notification AddProfileLiked(string username, Guid accountId);
    Notification AddMessageReceived(string username, Guid accountId);
    Notification AddProfileMatched(string username, Guid accountId);
    Notification AddProfileUnliked(string username, Guid accountId);
    int GetNotificationsCount(Guid currUserId);
    IEnumerable<NotificationsResponse> GetNotifications(Guid currUserId);
    void DeleteNotification(Guid id);
}

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IMapper _mapper;

    public NotificationService(INotificationRepository notificationRepository, IMapper mapper)
    {
        _notificationRepository = notificationRepository;
        _mapper = mapper;
    }

    public Notification Add(string text, Guid accountId, DateTime date, NotificationType type)
    {
        var newNotify = new Notification()
        {
            Text = text,
            AccountId = accountId,
            Date = date,
            NotificationType = type,
        };

        _notificationRepository.Add(newNotify);

        return newNotify;
    }

    public Notification AddProfileViewed(string username, Guid accountId)
    {
        return Add($"Your profile viewed by {username}!", accountId, DateTime.Now, NotificationType.ProfileViewed);
    }

    public Notification AddProfileLiked(string username, Guid accountId)
    {
        return Add($"Received new like from {username}!", accountId, DateTime.Now, NotificationType.ProfileLiked);
    }

    public Notification AddMessageReceived(string username, Guid accountId)
    {
        return Add($"Received new message from {username}!", accountId, DateTime.Now, NotificationType.MessageReceived);
    }

    public Notification AddProfileMatched(string username, Guid accountId)
    {
        return Add($"Congrats!!! You matched with {username}!", accountId, DateTime.Now, NotificationType.ProfileMatched);
    }

    public Notification AddProfileUnliked(string username, Guid accountId)
    {
        return Add($"Hey, {username} unliked you!", accountId, DateTime.Now, NotificationType.ProfileUnliked);
    }

    public int GetNotificationsCount(Guid currUserId)
    {
        return _notificationRepository.GetNotificationCount(currUserId);
    }

    public IEnumerable<NotificationsResponse> GetNotifications(Guid currUserId)
    {
        var notifications = _notificationRepository.GetNotifications(currUserId);

        return _mapper.Map<Notification, NotificationsResponse>(notifications, new List<NotificationsResponse>());
    }

    public void DeleteNotification(Guid id)
    {
        _notificationRepository.Delete(id);
    }
}
