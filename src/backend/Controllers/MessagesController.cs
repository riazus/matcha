namespace Backend.Controllers;

using Backend.Authorization;
using Backend.Models.Message;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("[controller]")]
public class MessagesController : BaseController
{
    private readonly IMessageService _messageService;

    public MessagesController(IMessageService messageService)
    {
        _messageService = messageService;
    }

    [HttpGet("options")]
    public ActionResult<MessageDataResponse> Get([FromQuery] MessageRequest options)
    {
        var res = _messageService.GetMessages(options);
        return Ok(res);
    }
}
