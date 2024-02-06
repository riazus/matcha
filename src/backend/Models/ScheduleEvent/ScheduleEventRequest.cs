namespace Backend.Models.ScheduleEvent;

using Backend.Helpers.Validators;

public class ScheduleEventRequest
{
    [Required]
    [IsGuid]
    public string ReceiverId { get; set; }

    [RequiredString]
    public string EventName { get; set; }

    [RequiredString]
    public string Description { get; set; }

    [RequiredString]
    public string EventDate { get; set; }
}
