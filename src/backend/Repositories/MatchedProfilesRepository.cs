using Backend.Entities;
using MiniORM;

namespace Backend.Repositories;

public interface IMatchedProfilesRepository
{
    bool IsTwoProfileMatched(Guid firstAccountId, Guid secondAccountId);
}

internal class MatchedProfilesRepository : IMatchedProfilesRepository
{
    private readonly IDBContext _context;

    public MatchedProfilesRepository(IDBContext context)
    {
        _context = context;
    }

    public bool IsTwoProfileMatched(Guid firstAccountId, Guid secondAccountId)
    {
        return _context.AnyWhere<MatchedProfiles>(
            $"(Profile1 = \'{firstAccountId}\' AND Profile2 = \'{secondAccountId}\')" +
            $" OR (Profile1 = \'{secondAccountId}\' AND Profile2 = \'{firstAccountId}\')");
    }
}
