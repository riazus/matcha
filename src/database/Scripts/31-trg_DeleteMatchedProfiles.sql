CREATE OR ALTER TRIGGER dbo.trg_DeleteMatchedProfiles
ON dbo.FavoriteProfile
AFTER DELETE
AS
BEGIN
SET NOCOUNT ON;

DELETE mp
FROM dbo.MatchedProfiles mp
INNER JOIN deleted d ON (d.FavoriteAccountId = mp.Profile1 AND d.LikedById = mp.Profile2) 
                      OR (d.FavoriteAccountId = mp.Profile2 AND d.LikedById = mp.Profile1);

END
GO