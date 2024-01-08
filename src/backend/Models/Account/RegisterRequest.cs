namespace Backend.Models.Account;

using Backend.Helpers.Validators;

public class RegisterRequest
{
    [RequiredString]
    public string FirstName { get; set; }
    [RequiredString]
    public string LastName { get; set; }
    [RequiredString]
    public string Username { get; set; }
    [RequiredString]
    [IsEmail]
    public string Email { get; set; }
    [RequiredString]
    public string Password { get; set; }
    [RequiredString]
    public string ConfirmPassword { get; set; }
}
