using Backend.Entities;
using MiniORM;

namespace Backend.Repositories;

public interface IBlockedProfileRepository
{
    void BlockAccount(BlockedProfile profile);
    BlockedProfile GetBlockedProfile(Guid firstId, Guid secondId);
    void DeleteBlockProfile(BlockedProfile profile);
}

internal class BlockedProfileRepository : IBlockedProfileRepository
{
    private readonly IDBContext _dbContext;

    public BlockedProfileRepository(IDBContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void BlockAccount(BlockedProfile profile)
    {
        _dbContext.Insert(profile);
    }

    public BlockedProfile GetBlockedProfile(Guid firstId, Guid secondId)
    {
        return _dbContext.GetWhere<BlockedProfile>($"(BlockedAccountId = \'{firstId}\' AND BlockedByAccountId = \'{secondId}\')" +
            $" OR BlockedAccountId = \'{secondId}\' AND BlockedByAccountId = \'{firstId}\'");
    }

    public void DeleteBlockProfile(BlockedProfile profile)
    {
        _dbContext.Delete<BlockedProfile>(profile.Id);
    }
}
