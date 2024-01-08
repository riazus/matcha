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
    public int? MinGap { get; set; }
    public int? MaxGap { get; set; }
}
