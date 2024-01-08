namespace Backend.Models.Account;

using Backend.Helpers.Validators;

public class ResetPasswordRequest
{
    [RequiredString]
    public string Token { get; set; }
    [RequiredString]
    public string Password { get; set; }
    [RequiredString]
    public string ConfirmPassword { get; set; }
}
