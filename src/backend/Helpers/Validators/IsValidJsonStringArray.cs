namespace Backend.Helpers.Validators;

using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
public class IsJsonStringArray : ValidationAttribute
{
    public override string FormatErrorMessage(string name)
    {
        return $"{name} field isn't valid json string array";
    }

    public override bool IsValid(object value)
    {
        string property = value as string;

        var res = JsonConvert.DeserializeObject<List<string>>(property);

        return res != null && res.Count > 0;
    }
}