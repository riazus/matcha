using Backend.Helpers.Validators;

namespace Backend.Models.Account;

public class GoogleOauthTokensRequest
{
    [RequiredString]
    public string IdToken { get; set; }
    [RequiredString]
    public string AccessToken { get; set; }
}
