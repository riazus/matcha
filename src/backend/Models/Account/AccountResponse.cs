namespace Backend.Models.Account;

using Backend.Entities;

public class AccountResponse
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime Created { get; set; }
    public string ProfilePictureUrl { get; set; }
    public List<string> AdditionalPicturesUrl { get; set; }
    public Orientation Gender { get; set; }
    public Orientation GenderPreferences { get; set; }
    public DateTime? Birthday { get; set; }
    public string Description { get; set; }
    public List<string> Tags { get; set; }
    public string Postcode { get; set; }
    public string Country { get; set; }
    public string Town { get; set; }
    public bool UserCanChat { get; set; } = false;
    public bool IsLiked { get; set; }
    public bool IsProfilesMatched { get; set; }
}
