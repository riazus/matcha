using System.Text.Json.Serialization;

namespace Backend.Models.Account;

public class GithubOauthTokensResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }
}
