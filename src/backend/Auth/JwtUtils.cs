﻿using Backend.Entities;
using Backend.Helpers;
using Backend.Repositories;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

public interface IJwtUtils
{
    public string GenerateJwtToken(Account account);
    public Guid? ValidateJwtToken(string token);
    public RefreshToken GenerateRefreshToken(string ipAddress);
}

public class JwtUtils : IJwtUtils
{
    private readonly IAccountRepository _accountRepository;
    private readonly AppSettings _appSettings;

    public JwtUtils(
        IAccountRepository accountRepository,
        IOptions<AppSettings> appSettings)
    {
        _accountRepository = accountRepository;
        _appSettings = appSettings.Value;
    }

    public string GenerateJwtToken(Account account)
    {
        // generate token that is valid for 15 minutes
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim("id", account.Id.ToString()) }),
            Expires = DateTime.UtcNow.AddMinutes(15),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public Guid? ValidateJwtToken(string token)
    {
        if (token == null)
            return null;

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
        try
        {
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var accountId = Guid.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);

            // return account id from JWT token if validation successful
            return accountId;
        }
        catch
        {
            // return null if validation fails
            return null;
        }
    }

    public RefreshToken GenerateRefreshToken(string ipAddress)
    {
        var refreshToken = new RefreshToken
        {
            // token is a cryptographically strong random sequence of values
            Token = Convert.ToHexString(RandomNumberGenerator.GetBytes(64)),
            // token is valid for 7 days
            Expires = DateTime.UtcNow.AddDays(7),
            Created = DateTime.UtcNow,
            CreatedByIp = ipAddress
        };

        // ensure token is unique by checking against db
        var tokenIsUnique = !_accountRepository.AnyRefreshToken(refreshToken.Token);

        if (!tokenIsUnique)
            return GenerateRefreshToken(ipAddress);

        return refreshToken;
    }
}