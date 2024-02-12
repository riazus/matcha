namespace Backend.Models.Account;

using Backend.Entities;

public class AccountsResponse
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public DateTime Created { get; set; }
    public string ProfilePictureUrl { get; set; }
    public Orientation Gender { get; set; }
    public Orientation GenderPreferences { get; set; }
    public DateTime? Birthday { get; set; }
    public string Description { get; set; }
    public string Country { get; set; }
    public string Town { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public List<string> Tags { get; set; }
    public int FameRating { get; set; }
    public DateTime? LastConnectionDate { get; set; }
}
