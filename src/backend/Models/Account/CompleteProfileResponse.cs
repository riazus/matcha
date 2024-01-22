namespace Backend.Models.Account;

public class CompleteProfileResponse
{
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public List<string> Tags { get; set; }
}
