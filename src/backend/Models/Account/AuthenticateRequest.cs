namespace Backend.Models.Account;

using Backend.Helpers.Validators;

public class AuthenticateRequest
{
    [RequiredString]
    [IsEmail]
    public string Email { get; set; }

    [RequiredString]
    public string Password { get; set; }
}