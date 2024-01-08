namespace Backend.Controllers;

using Backend.Authorization;
using Backend.Models.Notification;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("[controller]")]
public class NotificationsController : BaseController
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    public ActionResult<NotificationsResponse> Get()
    {
        var res = _notificationService.GetNotifications(Account.Id);
        return Ok(res);
    }

    [HttpGet("count")]
    public ActionResult<int> GetCount()
    {
        var res = _notificationService.GetNotificationsCount(Account.Id);
        return Ok(res);
    }

    [HttpDelete("{id:Guid}")]
    public ActionResult Delete(Guid id)
    {
        _notificationService.DeleteNotification(id);
        return NoContent();
    }
}
