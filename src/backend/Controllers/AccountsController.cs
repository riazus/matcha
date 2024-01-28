namespace Backend.Controllers;

using Backend.Authorization;
using Backend.Helpers;
using Backend.Models.Account;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

[Authorize]
[ApiController]
[Route("[controller]")]
public class AccountsController : BaseController
{
    private readonly IAccountService _accountService;
    private readonly AppSettings _appSettings;

    public AccountsController(IAccountService accountService, IOptions<AppSettings> appSettings)
    {
        _accountService = accountService;
        _appSettings = appSettings.Value;
    }

    [HttpGet]
    public ActionResult<List<AccountsResponse>> GetAll()
    {
        var res = _accountService.GetAll(Account);
        return Ok(res);
    }

    [HttpGet("{id:Guid}")]
    public ActionResult<AccountResponse> Get(Guid id)
    {
        var res = _accountService.GetById(Account, id);
        return Ok(res);
    }

    [HttpGet("filter/options")]
    public ActionResult<AccountsResponse> Get([FromQuery] AccountsFilter filter)
    {
        var res = _accountService.GetWithFilters(filter, Account);
        return Ok(res);
    }

    [AllowAnonymous]
    [HttpPost("auth")]
    public ActionResult<AuthenticateResponse> Authenticate(AuthenticateRequest model)
    {
        var authResponse = _accountService.Authenticate(model, ipAddress());
        setTokenCookie(authResponse.RefreshToken);
        return Ok(authResponse);
    }

    [AllowAnonymous]
    [HttpPost("verify-email")]
    public IActionResult VerifyEmail(VerifyEmailRequest model)
    {
        _accountService.VerifyEmail(model.Token);
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterRequest model)
    {
        var acc = _accountService.Register(model);

        _ = Task.Run(async () =>
        {
            await _accountService.SendVerificationEmail(acc, Request.Headers["origin"]);
        });

        return Ok(new { message = "Registration successful, please check your email for verification instructions" });
    }

    [HttpPost("revoke-token")]
    public IActionResult RevokeToken()
    {
        var token = Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(token))
            return BadRequest(new { message = "Token is required" });

        // users can revoke their own tokens
        var ownsToken = _accountService.OwnsToken(Account.Id, token);
        if (!ownsToken)
            return Unauthorized(new { message = "Unauthorized" });

        _accountService.RevokeToken(token, ipAddress());
        Response.Cookies.Delete("refreshToken");
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("refresh-token")]
    public ActionResult<AuthenticateResponse> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        var response = _accountService.RefreshToken(refreshToken, ipAddress());
        setTokenCookie(response.RefreshToken);
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest model)
    {
        var account = _accountService.ForgotPassword(model);

        _ = Task.Run(async () =>
        {
            await _accountService.SendPasswordResetEmail(account, Request.Headers["origin"]);
        });

        return Ok(new { message = "Please check your email for password reset instructions" });
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    public IActionResult ResetPassword(ResetPasswordRequest model)
    {
        _accountService.ResetPassword(model);
        return Ok(new { message = "Password reset successful, you can now login" });
    }

    [AllowAnonymous]
    [HttpGet("oauth/google")]
    public async Task GoogleOAuth([FromQuery]string code)
    {
        TokenResponse tokens = await _accountService.GoogleOAuth(code, ipAddress());
        setTokenCookie(tokens.RefreshToken);
        Response.Redirect($"{_appSettings.FrontendHost}/complete-profile");
    }

    [AllowAnonymous]
    [HttpGet("oauth/github")]
    public async Task GithubOAuth([FromQuery] string code)
    {
        TokenResponse tokens = await _accountService.GithubOAuth(code, ipAddress());
        setBothTokens(tokens);
        Response.Redirect($"{_appSettings.FrontendHost}/complete-profile");
    }

    [HttpPatch("complete-profile")]
    public ActionResult CompleteProfile([FromForm] CompleteProfileRequest formData)
    {
        var res = _accountService.CompleteProfile(formData, Account);
        return Ok(res);
    }

    [HttpGet("favorites")]
    public ActionResult<IEnumerable<AccountsResponse>> Favorites()
    {
        var res = _accountService.GetFavoriteAccounts(Account);
        return Ok(res);
    }

    [HttpPost("like/{id:Guid}")]
    public ActionResult Like(Guid id)
    {
        _accountService.LikeAccount(Account.Id, id);
        return Created($"accounts/like/{id}", null);
    }

    [HttpPost("dislike/{id:Guid}")]
    public ActionResult Dislike(Guid id)
    {
        _accountService.DislikeAccount(Account.Id, id);
        return Created($"accounts/dislike/{id}", null);
    }

    [HttpGet("pictures")]
    public ActionResult<PictureResponse> GetCurrentUserPictures()
    {
        var res = _accountService.GetCurrentUserPictures(Account);
        return Ok(res);
    }

    [HttpPatch("pictures")]
    public ActionResult UploadNewPictures([FromForm] CreateNewPictureRequest formData)
    {
        var pictureUrl = _accountService.CreateNewPicture(Account, formData.Picture);
        return Ok(new {pictureUrl});
    }

    // picture's name with extension
    [HttpDelete("pictures/{pictureId}")]
    public ActionResult DeletePictureById(string pictureId)
    {
        _accountService.DeletePictureById(Account, pictureId);
        return Ok();
    }

    // accounts which I viewed
    [HttpGet("my-views")]
    public ActionResult<AccountsResponse> MyProfileViews()
    {
        var res = _accountService.GetMyProfileViews(Account);
        return Ok(res);
    }

    // accounts which viewed ME
    [HttpGet("viewed-me")]
    public ActionResult<AccountsResponse> ProfilesViewed()
    {
        var res = _accountService.GetProfilesMeViewed(Account);
        return Ok(res);
    }

    [HttpGet("settings-data")]
    public ActionResult<SettingsDataResponse> GetSettingsData()
    {
        var res = _accountService.GetSettingsData(Account);
        return Ok(res);
    }

    [HttpPut("update-profile")]
    public ActionResult UpdateProfileSettings(UpdateProfileSettings req)
    {
        _accountService.UpdateProfileSettings(Account, req);
        return Ok();
    }

    [HttpPut("update-password")]
    public ActionResult UpdatePasswordSettings(UpdatePasswordSettingsRequest req)
    {
        _accountService.UpdatePasswordSettings(Account, req);
        return Ok();
    }

    [HttpPatch("update-profile-picture")]
    public ActionResult<UpdateProfilePictureResponse> UpdateProfilePicture([FromForm] UpdateProfilePictureRequest formData)
    {
        var profilePictureUrl = _accountService.UpdateProfilePicture(Account, formData.Picture);
        return Ok(new {profilePictureUrl});
    }

    [HttpPatch("update-location")]
    public ActionResult UpdateProfileLocation(AccountLocation req)
    {
        _accountService.UpdateProfileLocation(Account, req);
        return Ok();
    }

    #region Helpers
    private string ipAddress()
    {
        if (Request.Headers.ContainsKey("X-Forwarded-For"))
            return Request.Headers["X-Forwarded-For"];
        else
            return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
    }

    private void setTokenCookie(string token)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7),
        };
        Response.Cookies.Append("refreshToken", token, cookieOptions);
    }

    private void setBothTokens(TokenResponse tokens)
    {
        setTokenCookie(tokens.RefreshToken);

        var cookieOptions = new CookieOptions
        {
            Expires = DateTime.UtcNow.AddMinutes(3),
        };
        Response.Cookies.Append("jwtToken", tokens.JwtToken, cookieOptions);
    }
    #endregion
}