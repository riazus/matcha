using Backend.Repositories;

namespace Backend.Services;

public interface IMatchedProfilesService
{
    bool IsTwoProfileMatched(Guid firstAccountId, Guid secondAccountId);
}

public class MatchedProfilesService : IMatchedProfilesService
{
    private readonly IMatchedProfilesRepository _matchedProfileRepository;

    public MatchedProfilesService(IMatchedProfilesRepository matchedProfileRepository)
    {
        _matchedProfileRepository = matchedProfileRepository;
    }

    public bool IsTwoProfileMatched(Guid firstAccountId, Guid secondAccountId)
    {
        return _matchedProfileRepository.IsTwoProfileMatched(firstAccountId, secondAccountId);
    }
}