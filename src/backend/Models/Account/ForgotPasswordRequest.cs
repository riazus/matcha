namespace Backend.Models.Account;

using Backend.Helpers.Validators;

public class ForgotPasswordRequest
{
    [RequiredString]
    [IsEmail]
    public string Email { get; set; }
}
