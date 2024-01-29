namespace Backend.Models.Account;

public class PictureResponse
{
    public string ProfilePictureUrl { get; set; }
    public IEnumerable<string> AdditionalPicturesUrl { get; set; }
}
