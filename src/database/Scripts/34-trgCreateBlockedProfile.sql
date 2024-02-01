CREATE OR ALTER TRIGGER dbo.trg_CreateBlockedProfile
ON dbo.BlockedProfile
AFTER INSERT
AS
BEGIN
SET NOCOUNT ON;

DECLARE @currUserId UNIQUEIDENTIFIER, @blockedUserId UNIQUEIDENTIFIER

SELECT
	@currUserId = i.BlockedByAccountId,
	@blockedUserId = i.BlockedAccountId
FROM [inserted] i

DELETE FROM FavoriteProfile
WHERE (LikedById = @currUserId AND FavoriteAccountId = @blockedUserId) 
	OR (LikedById = @blockedUserId AND FavoriteAccountId = @currUserId)

END
GO