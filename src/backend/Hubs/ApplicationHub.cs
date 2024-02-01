namespace Backend.Hubs;

using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

public class ApplicationHub : Hub
{
    protected static ConcurrentDictionary<Guid, List<string>> _connectedNotificationClients = new();
    protected static ConcurrentDictionary<Guid, List<string>> _connectedMessageClients = new();

    protected Guid CurrentAccountId
    {
        get 
        {
            var context = Context.GetHttpContext();
            string currUserId = context.Request.Query["currUserId"];
            return Guid.Parse(currUserId);
        }
    }

    public static class NotificationEvent
    {
        public const string AddNotification = "AddNotification";
        public const string DeleteNotification = "DeleteNotification";
        public const string IncreaseNotificationsCount = "IncreaseNotificationsCount";
        public const string ReduceNotificationsCount = "ReduceNotificationsCount";
        public const string ProfileView = "ProfileView";
        public const string AddViewedProfile = "AddViewedProfile";
        public const string AddProfileMeViewed = "AddProfileMeViewed";
        public const string LikeProfile = "LikeProfile";
        public const string DislikeProfile = "DislikeProfile";
        public const string UnfavoriteProfile = "UnfavoriteProfile";
        public const string ProfilesMatched = "ProfilesMatched";
        public const string ProfilesUnmatched = "ProfilesUnmatched";
        public const string NotifyMessageReceived = "NotifyMessageReceived";
        public const string BlockProfile = "BlockProfile";
        public const string UnblockProfile = "UnblockProfile";
        public const string ProfileBlocked = "ProfileBlocked";
        public const string MyProfileWasBlocked = "MyProfileWasBlocked";
    }

    public static class ChatEvent
    {
        public const string NewMessage = "NewMessage";
        public const string MessageNotValid = "MessageNotValid";
        public const string NotifyInterlocutor = "NotifyInterlocutor";
        public const string DeleteMessages = "DeleteMessages";
    }
}
