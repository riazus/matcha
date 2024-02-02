namespace Backend.Models.Account;

using Backend.Helpers.Validators;

public class AccountsFilter
{
    [Required]
    public int MinAge { get; set; }
    [Required]
    public int MaxAge { get; set; }
    [Required]
    public int MinTag { get; set; }
    [Required]
    public int MaxTag { get; set; }
    [Required]
    public int MinFameRating { get; set; }
    [Required]
    public int MaxFameRating { get; set; }
    [Required]
    public int Page {  get; set; }
    [Required]
    public string OrderByField {  get; set; }
    [Required]
    public bool OrderByAsc { get; set; }
    public bool IsForBrowsing { get; set; } = false;
    public int? MinDistance { get; set; }
    public int? MaxDistance { get; set; }
}
