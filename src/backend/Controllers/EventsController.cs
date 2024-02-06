namespace Backend.Controllers;

using Backend.Authorization;
using Backend.Models.ScheduleEvent;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("[controller]")]
public class EventsController : BaseController
{
    private readonly IEventService _eventService;

    public EventsController(IEventService eventService)
    {
        _eventService = eventService;
    }

    [HttpGet("{profileId:Guid}")]
    public ActionResult<IEnumerable<ScheduledEventsResponse>> Get(Guid profileId)
    {
        var res = _eventService.GetScheduledEvents(Account.Id, profileId);
        return Ok(res);
    }

    [HttpPost]
    public ActionResult Create(ScheduleEventRequest req)
    {
        _eventService.CreateScheduledEvent(Account.Id, req);
        return Ok();
    }
}
