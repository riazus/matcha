using Backend.Helpers;
using Backend.Models.ScheduleEvent;
using Backend.Repositories;
using Backend.Entities;

namespace Backend.Services;

public interface IEventService
{
    IEnumerable<ScheduledEventsResponse> GetScheduledEvents(Guid currUserId, Guid secondAccountId);
    void CreateScheduledEvent(Guid currUserId, ScheduleEventRequest req);
}

public class EventService : IEventService
{
    private readonly IEventRepository _eventRepository;
    private readonly IMapper _mapper;

    public EventService(IEventRepository eventRepository, IMapper mapper)
    {
        _eventRepository = eventRepository;
        _mapper = mapper;
    }

    public IEnumerable<ScheduledEventsResponse> GetScheduledEvents(Guid currUserId, Guid secondAccountId)
    {
        var events = _eventRepository.GetScheduledEvents(currUserId, secondAccountId);

        return _mapper.Map<ScheduleEvent, ScheduledEventsResponse>(events, new List<ScheduledEventsResponse>());
    }

    public void CreateScheduledEvent(Guid currUserId, ScheduleEventRequest req)
    {
        var ev = new ScheduleEvent()
        {
            EventName = req.EventName,
            Description = req.Description,
            ReceiverId = Guid.Parse(req.ReceiverId),
            EventDate = DateTime.Parse(req.EventDate),
            SenderId = currUserId
        };

        _eventRepository.Create(ev);
    }
}