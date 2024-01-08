namespace Backend.Hubs;

using Backend.Services;
using Backend.Entities;
using Microsoft.AspNetCore.SignalR;

public class MessageHub : ApplicationHub
{
    private readonly IMessageService _messageService;
    private readonly INotificationService _notificationService;

    public MessageHub(IMessageService messageService, INotificationService notificationService)
    {
        _messageService = messageService;
        _notificationService = notificationService;
    }

    public override Task OnConnectedAsync()
    {
        var currUserId = CurrentAccountId;

        _connectedMessageClients.AddOrUpdate(
            currUserId,
            new List<string>() { Context.ConnectionId },
            (_, existingList) =>
            {
                existingList.Add(Context.ConnectionId);
                return existingList;
            }
        );

        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        var userId = CurrentAccountId;

        if (_connectedMessageClients.TryGetValue(userId, out var connectionIds))
        {
            connectionIds.Remove(Context.ConnectionId);

            if (connectionIds.Count == 0)
            {
                _connectedMessageClients.TryRemove(userId, out _);
            }
        }

        return base.OnDisconnectedAsync(exception);
    }

    public async Task NewMessage(string chatId, string username, 
        string currUserId, string interlocutorId, string message)
    {
        var messageValidation = newMessageValidation(chatId, currUserId, interlocutorId, message);

        if (!messageValidation.Valid)
        {
            await Clients.Client(Context.ConnectionId).SendAsync("MessageNotValid", messageValidation.Message);
            return;
        }

        var messageObj = new Message()
        {
            SenderId = messageValidation.CurrUserId,
            ChatId = messageValidation.ChatId,
            Date = DateTime.UtcNow,
            Text = message,
        };

        _messageService.CreateMessage(messageObj);

        await renderMessage(messageObj, username, messageValidation.InterlocutorId, messageValidation.CurrUserId);
    }

    private async Task renderMessage(Message message, string username, Guid interlocutorId, Guid currUserId)
    {
        if (_connectedMessageClients.TryGetValue(currUserId, out var currUserConnectionIds))
        {
            foreach (var connectionId in currUserConnectionIds)
            {
                await Clients.Client(connectionId).SendAsync("NewMessage", username, message.Text, message.Date.ToString());
            }
        }

        if (_connectedMessageClients.TryGetValue(interlocutorId, out var interlocutorConnectionIds))
        {
            foreach (var connectionId in interlocutorConnectionIds)
            {
                await Clients.Client(connectionId).SendAsync("NewMessage", username, message.Text, message.Date.ToString());
            }
        }
        else
        {
            var newNotify = _notificationService.AddMessageReceived(username, interlocutorId);

            await Clients.Client(Context.ConnectionId).SendAsync("NotifyInterlocutor", interlocutorId, newNotify);
        }
    }

    private NewMessageValidation newMessageValidation(string chatId, string currUserId, string interlocutorId, string message)
    {
        NewMessageValidation data = new()
        {
            Valid = true,
            Message = ""
        };

        if (message.Length > 512)
        {
            data.Valid = false;
            data.Message = "Message must be less than 512 characters";
            return data;
        }
        
        if (!Guid.TryParse(interlocutorId, out var parsedInterlocutorId)
            || !Guid.TryParse(chatId, out var parsedChatId)
            || !Guid.TryParse(currUserId, out var parsedCurrUserId))
        {
            data.Valid = false;
            data.Message = "Provided args to create new message not valid";
            return data;
        }

        data.InterlocutorId = parsedInterlocutorId;
        data.CurrUserId = parsedCurrUserId;
        data.ChatId = parsedChatId;

        return data;
    }

    class NewMessageValidation
    {
        public bool Valid;
        public string Message;
        public Guid InterlocutorId;
        public Guid CurrUserId;
        public Guid ChatId;
    }
}
