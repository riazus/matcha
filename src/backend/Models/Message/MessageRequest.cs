namespace Backend.Models.Message;

using Backend.Helpers.Validators;

public class MessageRequest
{
    [Required]
    [IsGuid]
    public string FirstUserId { get; set; }
    
    [Required]
    [IsGuid]
    public string SecondUserId { get; set; }
}
