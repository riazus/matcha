namespace Backend.Models.Account;

public class AccountLocation
{
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string Postcode { get; set; }
    public string Town { get; set; }
    public string Country {  get; set; }
}
