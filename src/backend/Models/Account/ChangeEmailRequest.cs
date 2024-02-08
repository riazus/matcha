namespace Backend.Models.Account;

using Backend.Helpers.Validators;

public class ChangeEmailRequest
{
    [RequiredString]
    [IsEmail]
    public string Email { get; set; }
}
