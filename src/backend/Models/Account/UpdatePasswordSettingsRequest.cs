namespace Backend.Models.Account;

using Backend.Helpers.Validators;

public class UpdatePasswordSettingsRequest
{
    [RequiredString]
    public string OldPassword { get; set; }
    [RequiredString]
    public string Password { get; set; }
    [RequiredString]
    public string ConfirmPassword { get; set; }
}
