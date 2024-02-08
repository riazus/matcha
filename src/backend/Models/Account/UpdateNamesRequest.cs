namespace Backend.Models.Account;

using Backend.Helpers.Validators;

public class UpdateNamesRequest
{
    [RequiredString]
    public string FirstName { get; set; }
    [RequiredString]
    public string LastName { get; set; }
}
