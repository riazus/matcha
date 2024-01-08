namespace Backend.Models.Message;

public class MessageDataResponse
{
    public string ChatId { get; set; }
    public IEnumerable<MessageResponse> Messages { get; set; }
}

public class MessageResponse
{
    public string Username { get; set; }
    public string Text { get; set; }
    public DateTime Date { get; set; }
}
