CREATE OR ALTER TRIGGER dbo.trg_CreateMatchedProfiles
ON dbo.FavoriteProfile
AFTER INSERT
AS
BEGIN
SET NOCOUNT ON;

INSERT INTO dbo.MatchedProfiles
(Id, [Date], Profile1, Profile2)
SELECT 
	newid(),
	getdate(),
	i.LikedById,
	i.FavoriteAccountId
FROM [inserted] as i
INNER JOIN dbo.FavoriteProfile fp ON fp.LikedById = i.FavoriteAccountId AND fp.FavoriteAccountId = i.LikedById;

END
GO