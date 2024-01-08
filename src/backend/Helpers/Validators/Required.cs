namespace Backend.Helpers.Validators;

using System.ComponentModel.DataAnnotations;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
public class Required : ValidationAttribute
{
    public override string FormatErrorMessage(string name)
    {
        return $"{name} field is required";
    }

    public override bool IsValid(object value)
    {
        return value != null;
    }
}