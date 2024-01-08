namespace Backend.Models.Account;

using Backend.Helpers.Validators;

public class VerifyEmailRequest
{
    [RequiredString]
    public string Token { get; set; }
}
