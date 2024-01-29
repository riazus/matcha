namespace Backend.Models.Account;

public class SettingsDataResponse
{
    public string ProfilePictureUrl { get; set; }
    public string Description { get; set; }
    public int Gender { get; set; }
    public int GenderPreferences { get; set; }
    public bool HasPassword { get; set; }
}
