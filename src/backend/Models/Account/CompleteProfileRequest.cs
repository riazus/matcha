namespace Backend.Models.Account;

using Backend.Helpers.Validators;

public class CompleteProfileRequest
{
    [Required]
    public IFormFile ProfilePicture { get; set; }
    public IEnumerable<IFormFile> AdditionalPictures { get; set; }
    [Required]
    [IsJsonStringArray]
    public string Tags { get; set; }
    [Required]
    public int Gender { get; set; }
    [Required]
    public int GenderPreferences { get; set; }
    public string Description { get; set; }
    [Required]
    public DateTime Birthday { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string Town { get; set; }
    public string Country { get; set; }
    public string Postcode { get; set; }
}
