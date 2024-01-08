using Backend.Entities;
using Backend.Helpers;
using Backend.Models.Message;
using Backend.Repositories;

namespace Backend.Services;

public interface IMessageService
{
    MessageDataResponse GetMessages(MessageRequest req);
    Chat GetChat(Guid firstProfileId, Guid secondProfileId);
    void CreateChat(Guid firstProfileId, Guid secondProfileId);
    void CreateMessage(Message message);
    void DeleteMessages(Guid chatId);
    void DeleteChat(Guid firstProfileId, Guid secondProfileId);
}

public class MessageService : IMessageService
{
    private readonly IMessageRepository _messageRepository;

    public MessageService(IMessageRepository messageRepository)
    {
        _messageRepository = messageRepository;
    }

    public MessageDataResponse GetMessages(MessageRequest req)
    {
        var firstProfileId = Guid.Parse(req.FirstUserId);
        var secondProfileId = Guid.Parse(req.SecondUserId);

        return _messageRepository.GetMessages(firstProfileId, secondProfileId);
    }

    public Chat GetChat(Guid firstProfile, Guid secondProfile)
    {
        return _messageRepository.GetChat(firstProfile, secondProfile);
    }

    public void CreateChat(Guid firstProfileId, Guid secondProfileId)
    {
        var chat = new Chat()
        {
            FirstAccountId = firstProfileId,
            SecondAccountId = secondProfileId,
        };

        _messageRepository.CreateChat(chat);
    }

    public void CreateMessage(Message message)
    {
        _messageRepository.CreateMessage(message);
    }

    public void DeleteMessages(Guid chatId)
    {
        _messageRepository.DeleteMessages(chatId);
    }

    public void DeleteChat(Guid firstProfile, Guid secondProfile)
    {
        var chat = GetChat(firstProfile, secondProfile);
        
        DeleteMessages(chat.Id);
        _messageRepository.DeleteChat(chat.Id);
    }
}
