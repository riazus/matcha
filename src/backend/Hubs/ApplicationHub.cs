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
}
