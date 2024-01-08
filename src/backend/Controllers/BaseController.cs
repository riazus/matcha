namespace Backend.Controllers;

using Backend.Entities;
using Microsoft.AspNetCore.Mvc;

[Controller]
public abstract class BaseController : ControllerBase
{
    public Account Account => (Account)HttpContext.Items["Account"];
}