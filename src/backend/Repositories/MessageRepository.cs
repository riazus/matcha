namespace Backend.Repositories;

using Backend.Entities;
using Backend.Models.Message;
using MiniORM;
using Org.BouncyCastle.Ocsp;

public interface IMessageRepository
{
    MessageDataResponse GetMessages(Guid firstProfileId, Guid secondProfileId);
    Chat GetChat(Guid firstProfileId, Guid secondProfileId);
    void CreateChat(Chat chat);
    void CreateMessage(Message message);
    bool TwoUsersHaveChat(Guid firstUserId, Guid secondUserId);
    void DeleteMessages(Guid chatId);
    void DeleteChat(Guid chatId);
    int GetMessagesCount(Guid firstProfileId, Guid secondProfileId);
}

internal class MessageRepository : IMessageRepository
{
    private readonly IDBContext _context;

    public MessageRepository(IDBContext context)
    {
        _context = context;
    }

    public MessageDataResponse GetMessages(Guid firstProfileId, Guid secondProfileId)
    {
        var messages = _context.GetListWithQuery<MessageResponse>(
            $"SELECT accRes.Username, mes.[Text], mes.[Date] FROM [Message] mes" +
            $" INNER JOIN Chat ch ON ch.Id = mes.ChatId" +
            $" INNER JOIN Account acc1 ON acc1.Id = ch.FirstAccountId" +
            $" INNER JOIN Account acc2 ON acc2.Id = ch.SecondAccountId" +
            $" INNER JOIN Account accRes ON accRes.Id = mes.SenderId" +
            $" WHERE (acc1.Id = \'{firstProfileId}\' AND acc2.Id = \'{secondProfileId}\')" +
               $" OR (acc1.Id = \'{secondProfileId}\' AND acc2.Id = \'{firstProfileId}\')" +
            $" ORDER BY [Date] ASC");

        var chat = GetChat(firstProfileId, secondProfileId);

        if (chat.FirstAccountId == Guid.Empty || chat.SecondAccountId == Guid.Empty)
        {
            throw new Exception("Chat cannot be empty");
        }

        var res = new MessageDataResponse() 
        { 
            ChatId = chat.Id.ToString(), 
            Messages = messages 
        };

        return res;
    }

    public Chat GetChat(Guid firstProfileId, Guid secondProfileId)
    {
        return _context.GetWhere<Chat>(
            $"(FirstAccountId = \'{firstProfileId}\' AND SecondAccountId = \'{secondProfileId}\')" +
            $" OR (FirstAccountId = \'{secondProfileId}\' AND SecondAccountId = \'{firstProfileId}\')");
    }

    public void CreateChat(Chat chat)
    {
        _context.Insert(chat);
    }

    public void CreateMessage(Message message)
    {
        _context.Insert(message);
    }

    public bool TwoUsersHaveChat(Guid firstUserId, Guid secondUserId)
    {
        return _context.AnyWhere<Chat>(
            $"(FirstAccountId = \'{firstUserId}\' AND SecondAccountId = \'{secondUserId}\')" +
            $" OR (FirstAccountId = '{secondUserId}' AND SecondAccountId = '{firstUserId}')");
    }

    public void DeleteMessages(Guid chatId)
    {
        _context.DeleteWhere<Message>($"ChatId = \'{chatId}\'");
    }

    public void DeleteChat(Guid chatId)
    {
        _context.DeleteWhere<Chat>($"Id = \'{chatId}\'");
    }

    public int GetMessagesCount(Guid firstProfileId, Guid secondProfileId)
    {
        var chat = GetChat(firstProfileId, secondProfileId);

        return _context.GetWhereCount<Message>($"ChatId = \'{chat.Id}\'");
    }
}
