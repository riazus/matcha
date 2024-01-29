﻿namespace Backend.Helpers;

public static class UrlCombine
{
    public static string Combine(string baseUrl, string relativeUrl)
    {
        if (string.IsNullOrWhiteSpace(baseUrl))
            throw new ArgumentNullException(nameof(baseUrl));

        if (string.IsNullOrWhiteSpace(relativeUrl))
            return baseUrl;

        baseUrl = baseUrl.TrimEnd('/');
        relativeUrl = relativeUrl.TrimStart('/');

        return $"{baseUrl}/{relativeUrl}";
    }

    public static string Combine(string baseUrl, params string[] relativePaths)
    {
        if (string.IsNullOrWhiteSpace(baseUrl))
            throw new ArgumentNullException(nameof(baseUrl));

        if (relativePaths.Length == 0)
            return baseUrl;

        var currentUrl = Combine(baseUrl, relativePaths[0]);

        return Combine(currentUrl, relativePaths.Skip(1).ToArray());
    }
}
