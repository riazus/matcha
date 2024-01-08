using System.Text.Json.Serialization;

namespace Backend.Models.Account
{
    public class TokenResponse
    {
        public string JwtToken { get; set; }
        [JsonIgnore] // refresh token is returned in http only cookie
        public string RefreshToken { get; set; }
    }
}
