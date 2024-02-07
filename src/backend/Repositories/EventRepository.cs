using Backend.Entities;
using MiniORM;

namespace Backend.Repositories;

public interface IEventRepository
{
    IEnumerable<ScheduleEvent> GetScheduledEvents(Guid firstAccountId, Guid secondAccountId);
    void Create(ScheduleEvent ev);
}

public class EventRepository : IEventRepository
{
    private readonly IDBContext _context;

    public EventRepository(IDBContext context)
    {
        _context = context;
    }

    public IEnumerable<ScheduleEvent> GetScheduledEvents(Guid firstAccountId, Guid secondAccountId)
    {
        return _context.GetWhereList<ScheduleEvent>($"(SenderId = \'{firstAccountId}\' AND ReceiverId = \'{secondAccountId}\')" +
            $" OR (SenderId = \'{secondAccountId}\' AND ReceiverId = \'{firstAccountId}\')");
    }

    public void Create(ScheduleEvent ev)
    {
        _context.Insert(ev);
    }
}
