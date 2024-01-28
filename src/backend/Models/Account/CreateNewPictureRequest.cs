namespace Backend.Models.Account;

using Backend.Helpers.Validators;

public class CreateNewPictureRequest
{
    [Required]
    public IFormFile Picture {  get; set; }
}
