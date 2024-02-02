CREATE OR ALTER TRIGGER dbo.trg_DeleteChat
ON dbo.MatchedProfiles
AFTER DELETE
AS
BEGIN
SET NOCOUNT ON;

DECLARE @chatId UNIQUEIDENTIFIER; 

SELECT 
	@chatId = ch.Id 
from Chat ch
INNER JOIN [deleted] d ON 
	(d.Profile1 = ch.FirstAccountId AND d.Profile2 = ch.SecondAccountId) 
	OR (d.Profile1 = ch.SecondAccountId AND d.Profile2 = ch.FirstAccountId)

DELETE FROM [Message]
WHERE ChatId = @chatId

DELETE FROM Chat
WHERE Id = @chatId

END
GO