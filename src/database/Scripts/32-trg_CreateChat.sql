CREATE OR ALTER TRIGGER dbo.trg_CreateChat
ON dbo.MatchedProfiles
AFTER INSERT
AS
BEGIN
SET NOCOUNT ON;

INSERT INTO dbo.Chat
(Id, FirstAccountId, SecondAccountId)
SELECT 
	newid(),
	i.Profile1,
	i.Profile2
FROM [inserted] as i

END
GO