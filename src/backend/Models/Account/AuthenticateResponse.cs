using System.Text.Json.Serialization;

namespace Backend.Models.Account
{
    public class AuthenticateResponse
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsProfileCompleted { get; set; }
        public string JwtToken { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public List<string> Tags { get; set; }
        [JsonIgnore] // refresh token is returned in http only cookie
        public string RefreshToken { get; set; }
    }
}
