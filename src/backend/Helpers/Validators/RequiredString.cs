namespace Backend.Helpers.Validators;

using System.ComponentModel.DataAnnotations;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
public class RequiredString : ValidationAttribute
{
    public override string FormatErrorMessage(string name)
    {
        return $"{name} field is required";
    }

    public override bool IsValid(object value)
    {
        string property = value as string;
        return property != null && property != string.Empty;
    }
}