namespace Backend.Entities;

using Backend.Helpers;
using MiniORM;
using Newtonsoft.Json;

public class Account
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username {get; set;}
    public string Email { get; set; }
    public string FirstName { get; set;}
    public string LastName { get; set;}
    public string PasswordHash { get; set; }
    public string VerificationToken { get; set; }
    public DateTime? Verified { get; set; }
    public string ResetToken { get; set; }
    public DateTime? ResetTokenExpires { get; set; }
    public DateTime? PasswordReset { get; set; }
    public DateTime Created { get; set; }
    public DateTime? Updated { get; set; }
    public string Provider { get; set; }
    public bool IsProfileCompleted { get; set; } = false;

    [Ignore]
    public string ProfilePictureUrl { get => getProfilePictureUrl(); }
    [Ignore]
    public List<string> AdditionalPicturesUrl { get => getAdditionalPicturesUrl(); }

    // Pictures in DB are storing only with relative path !!!
    public string RelativeProfilePictureUrl { get; set; }
    public string RelativeAdditionalPicturesUrlDB { get; set; }
    [Ignore]
    public List<string> RelativeAdditionalPicturesUrl
    {
        get => 
            RelativeAdditionalPicturesUrlDB != null 
                ? JsonConvert.DeserializeObject<List<string>>(RelativeAdditionalPicturesUrlDB) : null;
        set => RelativeAdditionalPicturesUrlDB = JsonConvert.SerializeObject(value);
    }

    public int? GenderDB { get; set; }
    [Ignore]
    public Orientation Gender 
    {
        get => (Orientation)GenderDB;
        set => GenderDB = (int)value;
    }
    
    public int? GenderPreferencesDB { get; set; }
    [Ignore]
    public Orientation GenderPreferences
    {
        get => (Orientation)GenderPreferencesDB;
        set => GenderPreferencesDB = (int)value;
    }

    public DateTime? Birthday { get; set; }

    public string Description { get; set; }

    public string TagsDB { get; set; }
    [Ignore]
    public List<string> Tags
    {
        get => 
            TagsDB != null ? JsonConvert.DeserializeObject<List<string>>(TagsDB) : null;
        set => TagsDB = JsonConvert.SerializeObject(value);
    }

    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string Postcode { get; set; }
    public string Country { get; set; }
    public string Town { get; set; }
    public int FameRating { get; set; } = 0;
    public DateTime? LastConnectionDate { get; set; }

    [Ignore]
    public List<RefreshToken> RefreshTokens { get; set; }
    [Ignore]
    public bool IsVerified => Verified.HasValue || PasswordReset.HasValue;

    #region private methods

    private string getProfilePictureUrl()
    {
        return combainApplicationPath(RelativeProfilePictureUrl);
    }

    private List<string> getAdditionalPicturesUrl()
    {
        if (RelativeAdditionalPicturesUrlDB == null)
        {
            return null;
        }

        var res = new List<string>();

        RelativeAdditionalPicturesUrl.ForEach(p =>
        {
            res.Add(combainApplicationPath(p));
        });

        return res;
    }

    private static string combainApplicationPath(string path)
    {
        // TODO !!!
        /*var uri = new Uri(Path.Combine("localhost:5000", path));
        return uri.AbsoluteUri.ToString();*/
        return UrlCombine.Combine("http://localhost:5000", path);
    }

    #endregion
}

public enum Orientation
{
    Male = 0,
    Female = 1,
    Bisexual = 2
}