namespace Backend.Models.Account;

using Backend.Helpers.Validators;

public class UpdateProfileSettings
{
    [RequiredString]
    public string Description { get; set; }
    [Required]
    public int Gender { get; set; }
    [Required]
    public int GenderPreferences { get; set; }
    [Required]
    public IEnumerable<string> Tags { get; set;}
}
