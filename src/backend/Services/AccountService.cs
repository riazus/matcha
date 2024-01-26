using Backend.Entities;
using Backend.Helpers;
using Backend.Models.Account;
using Backend.Repositories;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Services;

public interface IAccountService
{
    IEnumerable<AccountsResponse> GetAll(Account currUser);
    AccountResponse GetById(Account currUser, Guid id);
    IEnumerable<AccountsResponse> GetWithFilters(AccountsFilter filter, Account currUser);
    AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAdress);
    Account Register(RegisterRequest model);
    Task SendVerificationEmail(Account account, string origin);
    Task SendPasswordResetEmail(Account account, string origin);
    Task SendAlreadyRegisteredEmail(string email, string origin);
    void VerifyEmail(string token);
    Account ForgotPassword(ForgotPasswordRequest model);
    void ResetPassword(ResetPasswordRequest model);
    bool OwnsToken(Guid accountId, string token);
    void RevokeToken(string token, string ipAddress);
    AuthenticateResponse RefreshToken(string token, string ipAddress);
    Task<TokenResponse> GoogleOAuth(string code, string ipAddress);
    Task<TokenResponse> GithubOAuth(string code, string ipAddress);
    CompleteProfileResponse CompleteProfile(CompleteProfileRequest profileData, Account currUser);
    IEnumerable<AccountsResponse> GetFavoriteAccounts(Account currUser);
    void LikeAccount(Guid currUserId, Guid id);
    void DislikeAccount(Guid currUserId, Guid id);
    void AddProfileView(Guid currUserId, Guid id);
    PictureResponse GetCurrentUserPictures(Account currUser);
    void DeletePictureById(Account currUser, string pictureId);
    string CreateNewPicture(Account currUser, IFormFile newPicture);
    IEnumerable<AccountsResponse> GetMyProfileViews(Account currUser);
    IEnumerable<AccountsResponse> GetProfilesMeViewed(Account currUser);
    SettingsDataResponse GetSettingsData(Account currUser);
    void UpdateProfileSettings(Account currUser, UpdateProfileSettingsRequest req);
}

public class AccountService : IAccountService
{
    private readonly IAccountRepository _accountRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtUtils _jwtUtils;
    private readonly AppSettings _appSettings;
    private readonly IMapper _mapper;
    private readonly IEmailService _emailService;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMessageRepository _messageRepository;
    private readonly IMatchedProfilesService _matchedProfilesService;

    public AccountService(
        IAccountRepository accountRepository,
        IPasswordHasher passwordHasher,
        IJwtUtils jwtUtils,
        IOptions<AppSettings> appSettings,
        IMapper mapper,
        IEmailService emailService,
        IHttpClientFactory httpClientFactory,
        IMessageRepository messageRepository,
        IMatchedProfilesService matchedProfilesService
        )
    {
        _accountRepository = accountRepository;
        _passwordHasher = passwordHasher;
        _jwtUtils = jwtUtils;
        _appSettings = appSettings.Value;
        _mapper = mapper;
        _emailService = emailService;
        _httpClientFactory = httpClientFactory;
        _messageRepository = messageRepository;
        _matchedProfilesService = matchedProfilesService;
    }

    public AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress)
    {
        var account = validateAuthInput(model);

        var jwtToken = _jwtUtils.GenerateJwtToken(account);
        var refreshToken = _jwtUtils.GenerateRefreshToken(ipAddress);
        refreshToken.AccountId = account.Id;
        _accountRepository.AddRefreshToken(refreshToken);

        // return data in authenticate response object
        var response = _mapper.Map(account, new AuthenticateResponse());
        response.JwtToken = jwtToken;
        response.RefreshToken = refreshToken.Token;
        return response;
    }

    public IEnumerable<AccountsResponse> GetAll(Account currUser)
    {
        var accounts = _accountRepository.GetWhereProfileCompleted(currUser.Id);
        return _mapper.Map<Account, AccountsResponse>(accounts, new List<AccountsResponse>());
    }

    public AccountResponse GetById(Account currUser, Guid id)
    {
        var acc = _accountRepository.Get(id) ??
            throw new KeyNotFoundException($"Account with id {id} not found");

        var isCanChat = _messageRepository.TwoUsersHaveChat(currUser.Id, id);
        var isProfilesMatched = _matchedProfilesService.IsTwoProfileMatched(currUser.Id, id);
        var isLiked = _accountRepository.IsUserLikedProfile(currUser.Id, id);

        var res = _mapper.Map(acc, new AccountResponse());
        res.UserCanChat = isCanChat;
        res.IsLiked = isLiked;
        res.IsProfilesMatched = isProfilesMatched;

        return res;
    }

    public IEnumerable<AccountsResponse> GetWithFilters(AccountsFilter filter, Account currUser)
    {
        var accounts = _accountRepository.GetWithFilters(filter, currUser);
        return _mapper.Map<Account, AccountsResponse>(accounts, new List<AccountsResponse>());
    }

    public Account Register(RegisterRequest model)
    {
        bool isEmailExists = _accountRepository.Any(_accountRepository.GetProperty("Email"), model.Email);
        bool isUsernameExists = _accountRepository.Any(_accountRepository.GetProperty("Username"), model.Username);

        // validate
        if (isEmailExists)
        {
            throw new AppException("User with this email already exists");
        }
        else if (isUsernameExists)
        {
            throw new AppException("User with this username already exists");
        }

        // map model to new account object
        var account = _mapper.Map(model, new Account());

        account.Created = DateTime.UtcNow;
        account.VerificationToken = generateVerificationToken();

        // hash password
        account.PasswordHash = _passwordHasher.Hash(model.Password);

        _accountRepository.Add(account);

        return account;
    }

    public async Task SendAlreadyRegisteredEmail(string email, string origin)
    {
        var message = $@"<p>If you don't know your password please visit the <a href=""{origin}/forgot-password"">forgot password</a> page.</p>";

        await _emailService.SendAsync(
            to: email,
            subject: "Sign-up Verification Matcha - Email Already Registered",
            html: $@"<h4>Email Already Registered</h4>
                        <p>Your email <strong>{email}</strong> is already registered.</p>
                        {message}"
        );
    }

    public async Task SendPasswordResetEmail(Account account, string origin)
    {
        var resetUrl = $"{origin}/reset-password/{account.ResetToken}";
        var message = $@"<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                            <p><a href=""{resetUrl}"">Click here</a></p>";

        await _emailService.SendAsync(
            to: account.Email,
            subject: "Sign-up Verification Matcha - Reset Password",
            html: $@"<h4>Reset Password Email</h4>
                        {message}"
        );
    }

    public async Task SendVerificationEmail(Account account, string origin)
    {
        var verifyUrl = $"{origin}/verify-email/{account.VerificationToken}";
        var message = $@"<p>Please click the below link to verify your email address:</p>
                            <p><a href=""{verifyUrl}"">Click here</a></p>";

        await _emailService.SendAsync(
            to: account.Email,
            subject: "Sign-up Verification Matcha - Verify Email",
            html: $@"<h4>Verify Email</h4>
                        <p>Thanks for registering!</p>
                        {message}"
        );
    }

    public void VerifyEmail(string token)
    {
        var account = _accountRepository.GetByVerificationToken(token)
            ?? throw new AppException("Verification failed");

        account.Verified = DateTime.UtcNow;
        account.VerificationToken = null;

        _accountRepository.Update(account);
    }

    public Account ForgotPassword(ForgotPasswordRequest model)
    {
        var account = _accountRepository.GetByEmail(model.Email)
            ?? throw new AppException($"Email '{model.Email}' not found");

        if (account.PasswordHash.IsNullOrEmpty())
        {
            throw new AppException($"You don't need to change password, just login with {account.Provider} provider");
        }

        // create reset token that expires after 1 day
        account.ResetToken = generateResetToken();
        account.ResetTokenExpires = DateTime.UtcNow.AddDays(1);

        _accountRepository.Update(account);

        return account;
    }

    public void ResetPassword(ResetPasswordRequest model)
    {
        var account = _accountRepository.GetByResetToken(model.Token);

        // update password and remove reset token
        account.PasswordHash = _passwordHasher.Hash(model.Password);
        account.PasswordReset = DateTime.UtcNow;
        account.ResetToken = null;
        account.ResetTokenExpires = null;

        _accountRepository.Update(account);
    }

    public bool OwnsToken(Guid accountId, string token)
    {
        return _accountRepository.OwnsToken(accountId, token);
    }

    public void RevokeToken(string token, string ipAddress)
    {
        var account = _accountRepository.GetByRefreshToken(token);
        var refreshToken = _accountRepository.GetRefreshToken(token, account.Id);

        if (!refreshToken.IsActive)
            throw new AppException("Invalid token");

        // revoke token and save
        revokeRefreshToken(refreshToken, ipAddress, "Revoked without replacement");

        _accountRepository.UpdateRefreshToken(refreshToken);
    }

    public AuthenticateResponse RefreshToken(string token, string ipAddress)
    {
        if (token.IsNullOrEmpty())
        {
            throw new TokenNotFoundException("Refresh token not provided");
        }

        var account = _accountRepository.GetByRefreshToken(token)
            ?? throw new TokenNotFoundException("Invalid token");
        var refreshToken = _accountRepository.GetRefreshToken(token, account.Id);

        if (!refreshToken.IsActive)
        {
            throw new TokenNotFoundException("Token expired");
        }

        if (refreshToken.IsRevoked)
        {
            // revoke all descendant tokens in case this token has been compromised
            revokeDescendantRefreshTokens(refreshToken, account, ipAddress, $"Attempted reuse of revoked ancestor token: {token}");
        }

        // replace old refresh token with a new one (rotate token)
        var newRefreshToken = rotateRefreshToken(refreshToken, ipAddress);
        newRefreshToken.AccountId = account.Id;
        _accountRepository.AddRefreshToken(newRefreshToken);

        // remove old refresh tokens from account
        removeOldRefreshTokens(account);

        // generate new jwt
        var jwtToken = _jwtUtils.GenerateJwtToken(account);

        // return data in authenticate response object
        var response = _mapper.Map(account, new AuthenticateResponse());
        response.JwtToken = jwtToken;
        response.RefreshToken = newRefreshToken.Token;
        return response;
    }

    public async Task<TokenResponse> GoogleOAuth(string code, string ipAddress)
    {
        if (code == null)
        {
            throw new AppException("Authorization code not provided");
        }

        var credentials = await getGoogleOauthTokens(code);
        var googleUser = await getGoogleUser(credentials);

        if (!googleUser.VerifiedEmail)
        {
            throw new AppException("Google account not verified");
        }

        var account = createOrRetreiveGoogleUser(googleUser);

        return createAuthTokens(account, ipAddress);
    }

    public async Task<TokenResponse> GithubOAuth(string code, string ipAddress)
    {
        if (code == null)
        {
            throw new AppException("Authorization code not provided");
        }

        var credentials = await getGithubOauthTokens(code);
        var githubUser = await getGithubUser(credentials);

        var account = createOrRetreiveGithubUser(githubUser);

        return createAuthTokens(account, ipAddress);
    }

    public CompleteProfileResponse CompleteProfile(CompleteProfileRequest profileData, Account currUser)
    {
        string relativeUserImageDirectory = Path.Combine("Images", currUser.Id.ToString());
        string userImagesDirectory = Path.Combine(Directory.GetCurrentDirectory(), relativeUserImageDirectory);

        if (!Directory.Exists(userImagesDirectory))
        {
            Directory.CreateDirectory(userImagesDirectory);
        }

        var profilePictureId = Guid.NewGuid().ToString();
        string profilePictureUrl = Path.Combine(userImagesDirectory,
            $"{profilePictureId}{Path.GetExtension(profileData.ProfilePicture.FileName)}");
        string relativeProfilePictureUrl = Path.Combine(relativeUserImageDirectory,
            $"{profilePictureId}{Path.GetExtension(profileData.ProfilePicture.FileName)}");

        using var profileStream = new FileStream(profilePictureUrl, FileMode.Create);
        profileData.ProfilePicture.CopyTo(profileStream);

        if (profileData.AdditionalPictures != null)
        {
            var additionalPicturesUrls = new List<string>();

            foreach (var picture in profileData.AdditionalPictures)
            {
                var additionalPictureId = Guid.NewGuid().ToString();
                string additionalPictureUrl = Path.Combine(userImagesDirectory, $"{additionalPictureId}{Path.GetExtension(picture.FileName)}");
                string relativeAdditionalPictureUrl = Path.Combine(relativeUserImageDirectory,
                    $"{additionalPictureId}{Path.GetExtension(picture.FileName)}");
                using var additionalStream = new FileStream(additionalPictureUrl, FileMode.Create);
                picture.CopyTo(additionalStream);
                additionalPicturesUrls.Add(relativeAdditionalPictureUrl.Replace("\\", "/"));
            }

            currUser.RelativeAdditionalPicturesUrl = additionalPicturesUrls;
        }

        currUser.RelativeProfilePictureUrl = relativeProfilePictureUrl.Replace("\\", "/");
        currUser.Birthday = profileData.Birthday;
        currUser.Description = profileData.Description;
        currUser.Gender = (Orientation)profileData.Gender;
        currUser.GenderPreferences = (Orientation)profileData.GenderPreferences;
        currUser.Tags = JsonConvert.DeserializeObject<List<string>>(profileData.Tags);
        currUser.Longitude = profileData.Longitude;
        currUser.Latitude = profileData.Latitude;
        currUser.Postcode = profileData.Postcode;
        currUser.Country = profileData.Country;
        currUser.Town = profileData.Town;

        currUser.IsProfileCompleted = true;

        _accountRepository.Update(currUser);

        return new CompleteProfileResponse()
        {
            Latitude = currUser.Latitude,
            Longitude = currUser.Longitude,
            Tags = currUser.Tags,
        };
    }

    public IEnumerable<AccountsResponse> GetFavoriteAccounts(Account currUser)
    {
        var accs = _accountRepository.GetFavoriteAccounts(currUser.Id);
        return _mapper.Map<Account, AccountsResponse>(accs, new List<AccountsResponse>());
    }

    public void LikeAccount(Guid currUserId, Guid id)
    {
        var profiles = _accountRepository.GetFavoriteProfiles(currUserId);

        if (profiles != null && profiles.Any())
        {
            var alreadyLiked = profiles.SingleOrDefault(p => p.FavoriteAccountId == id) != null;

            if (alreadyLiked)
            {
                throw new AppException("Profile already liked");
            }
        }

        var like = new FavoriteProfile()
        {
            LikedById = currUserId,
            FavoriteAccountId = id
        };

        _accountRepository.AddFavoriteProfile(like);
    }

    public void DislikeAccount(Guid currUserId, Guid id)
    {
        var profiles = _accountRepository.GetFavoriteProfiles(currUserId);

        if (profiles != null && profiles.Any())
        {
            var alreadyLiked = profiles.SingleOrDefault(p => p.FavoriteAccountId == id) != null;
            if (!alreadyLiked)
            {
                throw new AppException("Account must first like this profile");
            }
        }
        else
        {
            throw new AppException("Account is not have any liked profiles");
        }

        _accountRepository.RemoveLike(currUserId, id);
    }

    public void AddProfileView(Guid currUserId, Guid id)
    {
        var view = new ProfileView()
        {
            ViewedById = currUserId,
            AccountId = id,
            Date = DateTime.Now,
        };

        _accountRepository.AddProfileView(view);
    }

    public PictureResponse GetCurrentUserPictures(Account currUser)
    {
        var additionalPicturesUrl = new string[4];

        int i = 0;
        currUser.AdditionalPicturesUrl?.ForEach((picture) =>
        {
            additionalPicturesUrl[i] = picture;
            i++;
        });

        return new PictureResponse()
        {
            ProfilePictureUrl = currUser.ProfilePictureUrl,
            AdditionalPicturesUrl = additionalPicturesUrl,
        };
    }

    public void DeletePictureById(Account currUser, string pictureId)
    {
        var imagePath = Path.Combine("Images", currUser.Id.ToString(), pictureId);

        if (Path.Exists(imagePath))
        {
            try
            {
                var ind = currUser.RelativeAdditionalPicturesUrl.FindIndex((url) =>
                {
                    return url.Contains(pictureId);
                });
                
                var tmpList = currUser.RelativeAdditionalPicturesUrl;
                tmpList.RemoveAt(ind);
                currUser.RelativeAdditionalPicturesUrl = tmpList;

                File.Delete(imagePath);

                _accountRepository.Update(currUser);
            }
            catch (Exception ex)
            {
                throw new AppException($"Error occured while deleting the file: {ex.Message}");
            }
        }
        else 
        { 
            throw new AppException("Image with following id doesn't exists");
        }
    }

    public string CreateNewPicture(Account currUser, IFormFile newPicture)
    {
        string relativeUserImageDirectory = Path.Combine("Images", currUser.Id.ToString());
        string userImagesDirectory = Path.Combine(Directory.GetCurrentDirectory(), relativeUserImageDirectory);

        var additionalPictureId = Guid.NewGuid().ToString();
        string addtionalPictureUrl = Path.Combine(userImagesDirectory,
            $"{additionalPictureId}{Path.GetExtension(newPicture.FileName)}");
        string relativeProfilePictureUrl = Path.Combine(relativeUserImageDirectory,
            $"{additionalPictureId}{Path.GetExtension(newPicture.FileName)}");

        using var profileStream = new FileStream(addtionalPictureUrl, FileMode.Create);
        newPicture.CopyTo(profileStream);

        var tmpList = currUser.RelativeAdditionalPicturesUrl ?? new List<string>();
        tmpList.Add(relativeProfilePictureUrl.Replace("\\", "/"));
        currUser.RelativeAdditionalPicturesUrl = tmpList;

        _accountRepository.Update(currUser);

        return currUser.AdditionalPicturesUrl[^1];
    }

    public IEnumerable<AccountsResponse> GetMyProfileViews(Account currUser)
    {
        var accs = _accountRepository.GetProfileViewsByAccount(currUser.Id);
        return _mapper.Map<Account, AccountsResponse>(accs, new List<AccountsResponse>());
    }

    public IEnumerable<AccountsResponse> GetProfilesMeViewed(Account currUser)
    {
        var accs = _accountRepository.GetProfilesMeViewed(currUser.Id);
        return _mapper.Map<Account, AccountsResponse>(accs, new List<AccountsResponse>());
    }

    public SettingsDataResponse GetSettingsData(Account currUser)
    {
        return new()
        {
            Description = currUser.Description,
            Gender = (int)currUser.Gender,
            GenderPreferences = (int)currUser.GenderPreferences,
            ProfilePictureUrl = currUser.ProfilePictureUrl,
            HasPassword = currUser.PasswordHash != null
        };
    }

    public void UpdateProfileSettings(Account currUser, UpdateProfileSettingsRequest req)
    {
        currUser.Tags = (List<string>)req.Tags;
        currUser.Gender = (Orientation)req.Gender;
        currUser.GenderPreferences = (Orientation)req.GenderPreferences;
        currUser.Description = req.Description;

        _accountRepository.Update(currUser);
    }

    #region Helper methods
    private void removeOldRefreshTokens(Account account)
    {
        _accountRepository.RemoveOldRefreshTokens(_appSettings.RefreshTokenTTL);
    }

    private string generateVerificationToken()
    {
        // token is a cryptographically strong random sequence of values
        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));

        // ensure token is unique by checking against db
        var tokenIsUnique = !_accountRepository.Any(_accountRepository.GetProperty("VerificationToken"), token);
        if (!tokenIsUnique)
            return generateVerificationToken();

        return token;
    }

    private string generateResetToken()
    {
        // token is a cryptographically strong random sequence of values
        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));

        // ensure token is unique by checking against db
        var tokenIsUnique = !_accountRepository.AnyResetToken(token);
        if (!tokenIsUnique)
            return generateResetToken();

        return token;
    }

    private void revokeRefreshToken(RefreshToken token, string ipAddress, string reason = null, string replacedByToken = null)
    {
        token.Revoked = DateTime.UtcNow;
        token.RevokedByIp = ipAddress;
        token.ReasonRevoked = reason;
        token.ReplacedByToken = replacedByToken;
        _accountRepository.UpdateRefreshToken(token);
    }

    private RefreshToken rotateRefreshToken(RefreshToken refreshToken, string ipAddress)
    {
        var newRefreshToken = _jwtUtils.GenerateRefreshToken(ipAddress);
        revokeRefreshToken(refreshToken, ipAddress, "Replaced by new token", newRefreshToken.Token);
        return newRefreshToken;
    }

    private void revokeDescendantRefreshTokens(RefreshToken refreshToken, Account account, string ipAddress, string reason)
    {
        // recursively traverse the refresh token chain and ensure all descendants are revoked
        if (!string.IsNullOrEmpty(refreshToken.ReplacedByToken))
        {
            var childToken = _accountRepository.GetRefreshToken(refreshToken.ReplacedByToken, account.Id);
            if (childToken.IsActive)
                revokeRefreshToken(childToken, ipAddress, reason);
            else
                revokeDescendantRefreshTokens(childToken, account, ipAddress, reason);
        }
    }

    private async Task<GoogleOauthTokensResponse> getGoogleOauthTokens(string code)
    {
        var httpClient = _httpClientFactory.CreateClient();
        var request = new HttpRequestMessage()
        {
            RequestUri = new Uri("https://oauth2.googleapis.com/token"),
            Method = HttpMethod.Post,
            Content = new StringContent($"code={code}&grant_type=authorization_code&client_id={_appSettings.Secrets.GoogleClientId}&client_secret={_appSettings.Secrets.GoogleClientSecret}&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Faccounts%2Foauth%2Fgoogle", Encoding.UTF8, "application/x-www-form-urlencoded")
        };

        try
        {
            var res = await httpClient.SendAsync(request);

            var json = await res.Content.ReadFromJsonAsync<GoogleOauthTokensResponse>() ?? throw new Exception();

            return json;
        }
        catch (Exception)
        {
            throw new AppException("Failed to fetch Google Oauth Tokens");
        }
    }

    private async Task<GoogleOauthUser> getGoogleUser(GoogleOauthTokensResponse credentials)
    {
        var httpClient = _httpClientFactory.CreateClient();
        var request = new HttpRequestMessage()
        {
            RequestUri = new Uri(
                $"https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token={credentials.AccessToken}"),
            Method = HttpMethod.Get
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", credentials.IdToken);

        try
        {
            var res = await httpClient.SendAsync(request);
            var json = await res.Content.ReadFromJsonAsync<GoogleOauthUser>() ?? throw new Exception();
            return json;
        }
        catch (Exception)
        {
            throw new AppException("Failed to fetch Google Oauth User");
        }
    }

    private Account createOrRetreiveGoogleUser(GoogleOauthUser googleUser)
    {
        var accExists = _accountRepository.GetByEmail(googleUser.Email);

        if (accExists == null)
        {
            Account account = new()
            {
                Email = googleUser.Email,
                Created = DateTime.Now,
                FirstName = googleUser.GivenName,
                LastName = googleUser.FamilyName,
                Username = getNewUsername(googleUser.GivenName, googleUser.FamilyName),
                Provider = "Google",
                Verified = DateTime.Now

            };
            _accountRepository.Add(account);

            return account;
        }

        return accExists;
    }

    private Account validateAuthInput(AuthenticateRequest model)
    {
        var account = _accountRepository.GetByEmail(model.Email)
            ?? throw new AppException("Email isn't correct");

        // validate
        if (!account.IsVerified)
        {
            throw new AppException("Email not validated");
        }
        else if (account.PasswordHash.IsNullOrEmpty())
        {
            throw new AppException($"Your account registered with {account.Provider}, " +
                $"please login with the same provider or create new one");
        }
        else if (!_passwordHasher.Verify(account.PasswordHash, model.Password))
        {
            throw new AppException("Password isn't correct");
        }

        return account;
    }

    private string getNewUsername(string firstName, string lastName)
    {
        string username = firstName[..1].ToLower() + lastName.ToLower();
        bool usernameExists = _accountRepository.Any(_accountRepository.GetProperty("Username"), username);
        int i = 2;

        while (usernameExists)
        {
            username += $"--{i++}";
        }

        return username;
    }

    private async Task<GithubOauthTokensResponse> getGithubOauthTokens(string code)
    {
        var httpClient = _httpClientFactory.CreateClient();
        var request = new HttpRequestMessage()
        {
            RequestUri = new Uri($"https://github.com/login/oauth/access_token?code={code}&client_id={_appSettings.Secrets.GithubClientId}&client_secret={_appSettings.Secrets.GithubClientSecret}"),
            Method = HttpMethod.Post,
        };
        request.Headers.TryAddWithoutValidation("Content-Type", "application/x-www-form-urlencoded");

        try
        {
            using var res = await httpClient.SendAsync(request);
            var content = await res.Content.ReadAsStringAsync();
            var keyValuePairs = ParseFormUrlEncoded(content);

            var githubOauthTokensResponse = new GithubOauthTokensResponse()
            {
                AccessToken = keyValuePairs["access_token"]
            };

            return githubOauthTokensResponse;
        }
        catch (Exception)
        {
            throw new AppException("Failed to fetch Github Oauth Tokens");
        }
    }

    private Dictionary<string, string> ParseFormUrlEncoded(string content)
    {
        return content
            .Split('&')
            .Select(pair => pair.Split('='))
            .ToDictionary(pair => Uri.UnescapeDataString(pair[0]), pair => Uri.UnescapeDataString(pair[1]));
    }

    private async Task<GithubOauthUser> getGithubUser(GithubOauthTokensResponse credentials)
    {
        var httpClient = _httpClientFactory.CreateClient();
        var request = new HttpRequestMessage()
        {
            RequestUri = new Uri("https://api.github.com/user"),
            Method = HttpMethod.Get
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", credentials.AccessToken);
        request.Headers.TryAddWithoutValidation("User-Agent", "Matcha");

        try
        {
            var res = await httpClient.SendAsync(request);
            var json = await res.Content.ReadFromJsonAsync<GithubOauthUser>() ?? throw new Exception();

            if (json.Email == null) // one more request for retreive email
            {
                var requestEmail = new HttpRequestMessage()
                {
                    RequestUri = new Uri("https://api.github.com/user/emails"),
                    Method = HttpMethod.Get
                };
                requestEmail.Headers.Authorization = new AuthenticationHeaderValue("Bearer", credentials.AccessToken);
                requestEmail.Headers.TryAddWithoutValidation("User-Agent", "Matcha");
                var resEmail = await httpClient.SendAsync(requestEmail);
                var jsonEmail = await resEmail.Content.ReadFromJsonAsync<GithubOauthUserEmails[]>() ?? throw new Exception();
                var primaryEmail = jsonEmail.Where(e => e.Primary == true).FirstOrDefault();
                if (primaryEmail != null && primaryEmail.Verified)
                {
                    json.Email = primaryEmail.Email;
                }
                else
                {
                    throw new Exception();
                }
            }

            return json;
        }
        catch (Exception)
        {
            throw new AppException("Failed to fetch Github Oauth User");
        }
    }

    private Account createOrRetreiveGithubUser(GithubOauthUser githubUser)
    {
        var accExists = _accountRepository.GetByEmail(githubUser.Email);

        if (accExists == null)
        {
            string[] names = githubUser.Name.Split(" ", StringSplitOptions.RemoveEmptyEntries);
            string lastName = "";


            if (names.Length > 1)
            {
                lastName = names[1];
            }

            Account account = new()
            {
                Email = githubUser.Email,
                Created = DateTime.Now,
                FirstName = names[0],
                LastName = lastName,
                Username = getNewUsername(names[0], lastName),
                Provider = "Github",
                Verified = DateTime.Now

            };
            _accountRepository.Add(account);

            return account;
        }

        return accExists;
    }

    private TokenResponse createAuthTokens(Account account, string ipAddress)
    {
        // authentication successful so generate jwt and refresh tokens
        var jwtToken = _jwtUtils.GenerateJwtToken(account);
        var refreshToken = _jwtUtils.GenerateRefreshToken(ipAddress);
        refreshToken.AccountId = account.Id;
        _accountRepository.AddRefreshToken(refreshToken);

        // remove old refresh tokens from account
        removeOldRefreshTokens(account);

        return new TokenResponse()
        {
            JwtToken = jwtToken,
            RefreshToken = refreshToken.Token
        };
    }
    #endregion
}