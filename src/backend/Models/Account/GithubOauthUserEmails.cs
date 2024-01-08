using System.Text.Json.Serialization;

namespace Backend.Models.Account;
public class GithubOauthUserEmails
{
    [JsonPropertyName("email")]
    public string Email { get; set; }

    [JsonPropertyName("primary")]
    public bool Primary { get; set; }

    [JsonPropertyName("verified")]
    public bool Verified { get; set; }

    [JsonPropertyName("visibility")]
    public string Visibility { get; set; }
}
