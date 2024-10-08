using Backend.Entities;
using Backend.Models.Account;
using Microsoft.IdentityModel.Tokens;
using MiniORM;
using System.Reflection;
using System.Text;

namespace Backend.Repositories;

public interface IAccountRepository
{
    IEnumerable<Account> Get();
    IEnumerable<Account> GetWhereProfileCompleted(Guid? userId = null);
    Account Get(Guid id, bool isProfileCompleted = true);
    Account GetByEmail(string email);
    Account GetByVerificationToken(string token);
    Account GetByResetToken(string resetToken);
    Account GetByRefreshToken(string refreshToken);
    Account GetByUsername(string username);
    IEnumerable<Account> GetWithFilters(AccountsFilter filter, Account currUser);
    RefreshToken GetRefreshToken(string refreshToken, Guid accountId);
    IEnumerable<Account> GetFavoriteAccounts(Guid accountId);
    IEnumerable<FavoriteProfile> GetFavoriteProfiles(Guid accountId);
    bool Any(PropertyInfo property, object value);
    bool AnyRefreshToken(string token);
    bool AnyResetToken(string token);
    void Update(Account account);
    void UpdateRefreshToken(RefreshToken refreshToken);
    void Add(Account account);
    void AddRefreshToken(RefreshToken refreshToken);
    void AddFavoriteProfile(FavoriteProfile profile);
    void AddUnfavoriteProfile(UnfavoriteProfile profile);
    void RemoveOldRefreshTokens(int refreshTokenTTL);
    bool OwnsToken(Guid accountId, string token);
    void RemoveLike(Guid currUserId, Guid id);
    void AddProfileView(ProfileView profileView);
    IEnumerable<Account> GetProfileViewsByAccount(Guid id);
    IEnumerable<Account>  GetProfilesMeViewed(Guid id);
    bool IsUserLikedProfile(Guid likedById, Guid id);
    PropertyInfo GetProperty(string propertyName);
    IEnumerable<Coord> GetAccountsCoords();
}

internal class AccountRepository : IAccountRepository
{
    private readonly IDBContext _context;

    public AccountRepository(IDBContext context)
    {
        _context = context;
    }

    public void Add(Account account)
    {
        _context.Insert(account);
    }

    public void AddRefreshToken(RefreshToken refreshToken)
    {
        _context.Insert(refreshToken);
    }

    public void AddFavoriteProfile(FavoriteProfile profile)
    {
        _context.Insert(profile);
    }

    public void AddUnfavoriteProfile(UnfavoriteProfile profile)
    {
        _context.Insert(profile);
    }

    public bool Any(PropertyInfo property, object value)
    {
        return _context.Any<Account>(property, value);
    }

    public bool AnyRefreshToken(string token)
    {
        PropertyInfo property = this.GetProperty("VerificationToken");
        return _context.Any<Account>(property!, token);
    }

    public bool AnyResetToken(string token)
    {
        PropertyInfo property = this.GetProperty("ResetToken");
        return _context.Any<Account>(property!, token);
    }

    public IEnumerable<Account> Get()
    {
        return _context.Get<Account>();
    }

    public IEnumerable<Account> GetWhereProfileCompleted(Guid? userId = null)
    {
        var where = "IsProfileCompleted = 1";

        if (userId != null)
        {
            where += $" AND Id != \'{userId}\'";
        }

        return _context.GetWhereList<Account>(where);
    }

    public Account Get(Guid id, bool isProfileCompleted = true)
    {
        var where = $"Id = \'{id}\'";

        if (isProfileCompleted)
        {
            where += " AND IsProfileCompleted = 1";
        }

        Account account = _context.GetWhere<Account>(where);

        if (account.Id != id)
        {
            return null;
        }

        return account;
    }

    public Account GetByEmail(string email)
    {
        PropertyInfo property = this.GetProperty("Email");
        Account acc = _context.Get<Account>(property!, email);

        if (acc.Email != email)
        {
            return null;
        }

        return acc;
    }

    public Account GetByResetToken(string resetToken)
    {
        PropertyInfo property = this.GetProperty("ResetToken");
        Account acc = _context.Get<Account>(property!, resetToken);

        if (acc.ResetToken != resetToken)
        {
            return null;
        }

        return acc;
    }

    public IEnumerable<Coord> GetAccountsCoords()
    {
        var res = new List<Coord>();
        var accs = _context.GetWhereList<Account>("Latitude IS NOT NULL AND Longitude IS NOT NULL").ToList();


        accs?.ForEach((acc) =>
        {
            res.Add(new Coord() { Lat = acc.Latitude, Lng = acc.Longitude });
        });

        return res;
    }

    public Account GetByVerificationToken(string token)
    {
        PropertyInfo property = this.GetProperty("VerificationToken");
        Account acc = _context.Get<Account>(property!, token);

        if (acc.VerificationToken != token)
        {
            return null;
        }

        return acc;
    }

    public Account GetByRefreshToken(string token)
    {
        Account acc = _context.GetWhere<Account>(
            $"Id IN (SELECT AccountId FROM RefreshToken WHERE Token = \'{token}\')");

        if (acc.Email.IsNullOrEmpty())
        {
            return null;
        }

        return acc;
    }

    public Account GetByUsername(string username)
    {
        PropertyInfo property = this.GetProperty("Username");
        Account acc = _context.Get<Account>(property!, username);

        if (acc.Username != username)
        {
            return null;
        }

        return acc;
    }

    public RefreshToken GetRefreshToken(string refreshToken, Guid accountId)
    {
        var token = _context.GetWhere<RefreshToken>(
            $"AccountId = \'{accountId}\' AND Token = \'{refreshToken}\'");

        if (token.AccountId != accountId)
        {
            return null;
        }

        return token;
    }

    public IEnumerable<Account> GetWithFilters(AccountsFilter filter, Account currUser)
    {
        Func<StringBuilder, StringBuilder> addOrderBy = (_) => throw new Exception("Delegate unitialized");

        StringBuilder query = new();
        bool isDistanceFilterable = 
            filter.MinDistance.HasValue
            && filter.MaxDistance.HasValue
            && currUser.Latitude.HasValue
            && currUser.Longitude.HasValue;


        query.Append("SELECT acc1.* FROM Account acc1");

        query.Append($" CROSS APPLY (SELECT COUNT(*) as CommonTagsCount FROM OPENJSON(\'{currUser.TagsDB}\') mainUserTag" +
            $" JOIN OPENJSON(acc1.TagsDB) userTag ON mainUserTag.value = userTag.value) AS Tags");

        if (isDistanceFilterable)
        {
            query.Append(" CROSS APPLY (" +
                $" SELECT ROUND(GEOGRAPHY::Point(acc1.Latitude, acc1.Longitude, 4326).STDistance(GEOGRAPHY::Point({currUser.Latitude}, {currUser.Longitude}, 4326)) / 1000, 4) AS Distance" +
                $" ) AS Distance");
        }

        var minFameRating = filter.MinFameRating == -1001 ? int.MinValue : filter.MinFameRating;
        var maxFameRating = filter.MaxFameRating == 1001 ? int.MaxValue : filter.MaxFameRating;

        query.Append($" WHERE JSON_QUERY(acc1.TagsDB) IS NOT NULL" +
            $" AND Tags.CommonTagsCount BETWEEN {filter.MinTag} AND {filter.MaxTag}" +
            $" AND DATEDIFF(YEAR, acc1.Birthday, GETDATE()) BETWEEN {filter.MinAge} AND {filter.MaxAge}" +
            $" AND acc1.FameRating BETWEEN {minFameRating} AND {maxFameRating}" +
            $" AND acc1.Id != \'{currUser.Id}\'");

        if (isDistanceFilterable)
        {
            query.Append($" AND Distance.Distance BETWEEN {filter.MinDistance} AND {filter.MaxDistance}" +
                $" AND acc1.Latitude IS NOT NULL AND acc1.Longitude IS NOT NULL");
        }

        if (filter.IsForBrowsing)
        {
            query.Append($" AND acc1.GenderDB = {currUser.GenderPreferencesDB} AND acc1.GenderPreferencesDB = {currUser.GenderDB}" +
                $" AND acc1.Id NOT IN (SELECT fp.FavoriteAccountId FROM FavoriteProfile fp WHERE fp.LikedById = \'{currUser.Id}\')" +
                $" AND acc1.Id NOT IN (SELECT up.UnfavoriteAccountId FROM UnfavoriteProfile up WHERE up.DislikedById = \'{currUser.Id}\')");
        }

        query.Append(" ORDER BY");

        if (filter.OrderByField.IsNullOrEmpty())
        {
            if (isDistanceFilterable)
            {
                query.Append(" Distance.Distance");
                addOrderBy = (query) => query.Append(", Tags.CommonTagsCount DESC, acc1.FameRating DESC");
            }
            else
            {
                query.Append(" Tags.CommonTagsCount");
                addOrderBy = (query) => query.Append(", acc1.FameRating DESC");
            }
        }
        else if (filter.OrderByField == "Distance" && isDistanceFilterable)
        {
            query.Append(" Distance.Distance");
            addOrderBy = (query) => query.Append(", Tags.CommonTagsCount DESC, acc1.FameRating DESC");
        } 
        else if (filter.OrderByField == "Age")
        {
            query.Append(" acc1.Birthday");
            var additionOrderBy = (isDistanceFilterable ? ", Distance.Distance ASC" : "") + ", Tags.CommonTagsCount DESC, acc1.FameRating DESC";
            addOrderBy = (query) => query.Append(additionOrderBy);
        }
        else if (filter.OrderByField == "Tags")
        {
            query.Append(" Tags.CommonTagsCount");
            var additionOrderBy = (isDistanceFilterable ? ", Distance.Distance ASC" : "") + ", acc1.FameRating DESC";
            addOrderBy = (query) => query.Append(additionOrderBy);
        }
        else if (filter.OrderByField == "FameRating")
        {
            query.Append(" acc1.FameRating");
            var additionOrderBy = (isDistanceFilterable ? ", Distance.Distance ASC" : "") + ", Tags.CommonTagsCount DESC";
            addOrderBy = (query) => query.Append(additionOrderBy);
        }
        else
        {
            throw new Exception("Provided invalid order by column");
        }

        query.Append(filter.OrderByAsc ? " ASC" : " DESC");
        addOrderBy.Invoke(query);
        query.Append(", Id");

        if (filter.IsForBrowsing)
        {
            /*Why 4? Because this represents the remaining users in the current list
            It will fetch the next 20 users regardless of the page number
            This is because in the case of IsForBrowsing, we filter out users that already
            exist in the FavoriteProfile or UnfavoriteProfile tables
            So, 4 is very important number and must be equal to the value of
            frontend (before how much rest of profiles front will fetch) */
            
            var offeset = filter.Page == 0 ? 0 : 4;
            query.Append($" OFFSET ({offeset}) ROWS FETCH NEXT 20 ROWS ONLY;");
        }
        else
        {
            query.Append($" OFFSET (20 * {filter.Page}) ROWS FETCH NEXT 20 ROWS ONLY;");
        }

        var accounts = _context.GetListWithQuery<Account>(query.ToString());

        return accounts;
    }

    public IEnumerable<Account> GetFavoriteAccounts(Guid accountId)
    {
        return _context.GetWhereList<Account>(
            $"Id IN (SELECT FavoriteAccountId FROM FavoriteProfile WHERE LikedById = \'{accountId}\')");
    }

    public IEnumerable<FavoriteProfile> GetFavoriteProfiles(Guid accountId)
    {
        return _context.GetWhereList<FavoriteProfile>(
            $"LikedById = \'{accountId}\'");
    }

    public bool OwnsToken(Guid accountId, string token)
    {
        return _context.AnyWhere<RefreshToken>(
            $"AccountId = \'{accountId}\' AND Token = \'{token}\'");
    }

    public void RemoveOldRefreshTokens(int refreshTokenTTL)
    {
        _context.DeleteWhere<RefreshToken>(
            $"Revoked IS NULL AND \'{DateTime.UtcNow}\' >= Expires" +
            $" AND DATEADD(day, {refreshTokenTTL}, Created) <= GETUTCDATE()");
    }

    public void Update(Account account)
    {
        _context.Update<Account>(account);
    }

    public void UpdateRefreshToken(RefreshToken refreshToken)
    {
        _context.Update<RefreshToken>(refreshToken);
    }

    public void RemoveLike(Guid currUserId, Guid id)
    {
        _context.DeleteWhere<FavoriteProfile>(
            $"LikedById = \'{currUserId}\' AND FavoriteAccountId = \'{id}\'");
    }

    public void AddProfileView(ProfileView profileView)
    {
        _context.Insert(profileView);
    }

    public IEnumerable<Account> GetProfileViewsByAccount(Guid id)
    {
        return _context.GetListWithQuery<Account>(
            $"SELECT acc.* FROM Account acc" +
            $" INNER JOIN ProfileView pv ON pv.AccountId = acc.Id" +
            $" WHERE pv.ViewedById = \'{id}\'" +
            $" ORDER BY pv.Date DESC");
    }

    public IEnumerable<Account> GetProfilesMeViewed(Guid id)
    {
        return _context.GetListWithQuery<Account>(
            $"SELECT acc.* FROM Account acc" +
            $" INNER JOIN ProfileView pv ON pv.ViewedById = acc.Id" +
            $" WHERE pv.AccountId = \'{id}\'" +
            $" ORDER BY pv.Date DESC");
    }

    public bool IsUserLikedProfile(Guid likedById, Guid id)
    {
        return _context.AnyWhere<FavoriteProfile>(
            $"LikedById = \'{likedById}\' AND FavoriteAccountId = \'{id}\'");
    }

    public PropertyInfo GetProperty(string propertyName)
    {
        return typeof(Account).GetProperty(propertyName) 
            ?? throw new Exception($"Provided property \"{propertyName}\" not exists");
    }
}