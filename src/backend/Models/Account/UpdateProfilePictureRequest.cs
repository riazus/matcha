namespace Backend.Models.Account;

using Backend.Helpers.Validators;

public class UpdateProfilePictureRequest
{
    [Required]
    public IFormFile Picture { get; set; }
}
