namespace Backend.Helpers.Validators;

using System.ComponentModel.DataAnnotations;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
public partial class IsGuid : ValidationAttribute
{
    public override string FormatErrorMessage(string name)
    {
        return $"{name} field is not valid guid";
    }

    public override bool IsValid(object value)
    {
        string property = value as string;

        return Guid.TryParse(property, out Guid _);
    }
}