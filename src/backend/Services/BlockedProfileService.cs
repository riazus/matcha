using Backend.Entities;
using Backend.Repositories;

namespace Backend.Services;

public interface IBlockedProfileService
{
    void AddBlockAccount(Guid blockedAccountId, Guid blockedById);
    BlockedProfile GetBlockedProfile(Guid firstId, Guid secondId);
    void DeleteBlockAccount(Guid unblockedAccountId, Guid unblockedById);
}

public class BlockedProfileService : IBlockedProfileService
{
    private readonly IBlockedProfileRepository _blockedProfileRepository;

    public BlockedProfileService(IBlockedProfileRepository blockedProfileRepository)
    {
        _blockedProfileRepository = blockedProfileRepository;
    }

    public void AddBlockAccount(Guid blockedAccountId, Guid blockedById)
    {
        var link = new BlockedProfile()
        {
            BlockedAccountId = blockedAccountId,
            BlockedByAccountId = blockedById
        };

        _blockedProfileRepository.BlockAccount(link);
    }

    public BlockedProfile GetBlockedProfile(Guid firstId, Guid secondId)
    {
        return _blockedProfileRepository.GetBlockedProfile(firstId, secondId);
    }

    public void DeleteBlockAccount(Guid unblockedAccountId, Guid unblockedById)
    {
        var blockProfile = GetBlockedProfile(unblockedAccountId, unblockedById);

        if (blockProfile != null)
        {
            _blockedProfileRepository.DeleteBlockProfile(blockProfile);
        }
    }
}
