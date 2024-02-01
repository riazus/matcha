CREATE DATABASE matchaDB;
GO

USE matchaDB;
GO


/* TABLES */

-- Account
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Account]') AND type in (N'U'))
DROP TABLE [dbo].[Account]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE Account (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Username NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(255) NOT NULL,
    LastName NVARCHAR(255) NOT NULL,
    PasswordHash NVARCHAR(255) NULL,
    VerificationToken NVARCHAR(255),
    Verified DATETIME NULL,
    ResetToken NVARCHAR(255),
    ResetTokenExpires DATETIME NULL,
    PasswordReset DATETIME NULL,
    Created DATETIME NOT NULL,
    Updated DATETIME NULL,
    [Provider] NVARCHAR(255) NULL,
    IsProfileCompleted BIT NOT NULL,
	RelativeProfilePictureUrl NVARCHAR(255) NULL,
	RelativeAdditionalPicturesUrlDB NVARCHAR(MAX) NULL,
	GenderDB INT NULL,
	GenderPreferencesDB INT NULL,
	Birthday DATETIME NULL,
	[Description] NVARCHAR(512) NULL,
	TagsDB NVARCHAR(512) NULL,
	Latitude FLOAT NULL,
	Longitude FLOAT NULL,
    Postcode NVARCHAR(10) NULL,
    Country NVARCHAR(128) NULL,
    Town NVARCHAR(128) NULL,
    CONSTRAINT Unique_Username UNIQUE (Username),
    CONSTRAINT Unique_Email UNIQUE (Email)
);
GO

-- RefreshToken
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RefreshToken]') AND type in (N'U'))
DROP TABLE [dbo].[RefreshToken]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE RefreshToken (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    AccountId UNIQUEIDENTIFIER NOT NULL,
    Token NVARCHAR(255) NOT NULL,
    Expires DATETIME NOT NULL,
    Created DATETIME NOT NULL,
    CreatedByIp NVARCHAR(255),
    Revoked DATETIME NULL,
    RevokedByIp NVARCHAR(255),
    ReplacedByToken NVARCHAR(255),
    ReasonRevoked NVARCHAR(255),
    FOREIGN KEY (AccountId) REFERENCES Account(Id)
);
GO

-- Chat
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Chat]') AND type in (N'U'))
DROP TABLE [dbo].[Chat]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE Chat (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    FirstAccountId UNIQUEIDENTIFIER NOT NULL,
    SecondAccountId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (FirstAccountId) REFERENCES Account(Id),
    FOREIGN KEY (SecondAccountId) REFERENCES Account(Id)
);
GO

-- Message
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Message]') AND type in (N'U'))
DROP TABLE [dbo].[Message]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [Message] (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    SenderId UNIQUEIDENTIFIER NOT NULL,
    ChatId UNIQUEIDENTIFIER NOT NULL,
    [Text] NVARCHAR(512) NOT NULL,
    [Date] DATETIME NOT NULL,
    FOREIGN KEY (SenderId) REFERENCES Account(Id),
    FOREIGN KEY (ChatId) REFERENCES Chat(Id)
);
GO

-- FavoriteProfile
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[FavoriteProfile]') AND type in (N'U'))
DROP TABLE [dbo].[FavoriteProfile]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [FavoriteProfile] (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    LikedById UNIQUEIDENTIFIER NOT NULL,
    FavoriteAccountId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (LikedById) REFERENCES Account(Id),
    FOREIGN KEY (FavoriteAccountId) REFERENCES Account(Id)
);
GO

-- ProfileView
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ProfileView]') AND type in (N'U'))
DROP TABLE [dbo].[ProfileView]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [ProfileView] (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    ViewedById UNIQUEIDENTIFIER NOT NULL,
    AccountId UNIQUEIDENTIFIER NOT NULL,
    [Date] DATETIME NOT NULL,
    FOREIGN KEY (ViewedById) REFERENCES Account(Id),
    FOREIGN KEY (AccountId) REFERENCES Account(Id)
);
GO

-- Notification
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Notification]') AND type in (N'U'))
DROP TABLE [dbo].[Notification]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [Notification] (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    AccountId UNIQUEIDENTIFIER NOT NULL,
    [Text] NVARCHAR(256) NOT NULL,
    [Date] DATETIME NOT NULL,
    IsViewed BIT NOT NULL,
    NotificationTypeDB INT NOT NULL,
    FOREIGN KEY (AccountId) REFERENCES Account(Id)
);
GO

-- MatchedProfiles
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MatchedProfiles]') AND type in (N'U'))
DROP TABLE [dbo].[MatchedProfiles]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [MatchedProfiles] (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Profile1 UNIQUEIDENTIFIER NOT NULL,
    Profile2 UNIQUEIDENTIFIER NOT NULL,
	[Date] DATETIME NOT NULL,
    FOREIGN KEY (Profile1) REFERENCES Account(Id),
    FOREIGN KEY (Profile2) REFERENCES Account(Id)
);
GO

-- UnfavoriteProfile
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UnfavoriteProfile]') AND type in (N'U'))
DROP TABLE [dbo].[UnfavoriteProfile]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [UnfavoriteProfile] (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    DislikedById UNIQUEIDENTIFIER NOT NULL,
    UnfavoriteAccountId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (DislikedById) REFERENCES Account(Id),
    FOREIGN KEY (UnfavoriteAccountId) REFERENCES Account(Id)
);
GO

-- BlockedProfile
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[BlockedProfile]') AND type in (N'U'))
DROP TABLE [dbo].[BlockedProfile]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [BlockedProfile] (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    BlockedAccountId UNIQUEIDENTIFIER NOT NULL,
    BlockedByAccountId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (BlockedAccountId) REFERENCES Account(Id),
    FOREIGN KEY (BlockedByAccountId) REFERENCES Account(Id)
);
GO



/* INDEXES */

CREATE NONCLUSTERED INDEX [NCI_Date] ON [dbo].[Message]
(
	[Date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO


/* TRIGGERS */

-- trg_CreateMatchedProfiles
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


-- trg_DeleteMatchedProfiles
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

-- trg_CreateChat
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

-- trg_DeleteChat
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

-- trg_CreateBlockedProfile
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




/* SETUP DUMMY ACCOUNTS */


DECLARE @i INT = 0;
WHILE @i < 30
BEGIN
    SET @i = @i + 1;

    INSERT INTO [dbo].[Account]
    ([Id],[Username],[Email],[FirstName],[LastName],[PasswordHash]
    ,[VerificationToken],[Verified],[ResetToken],[ResetTokenExpires]
    ,[PasswordReset],[Created],[Updated],[Provider],[IsProfileCompleted]
    ,[RelativeProfilePictureUrl],[RelativeAdditionalPicturesUrlDB],[GenderDB]
    ,[GenderPreferencesDB],[Birthday],[Description],[TagsDB],[Latitude]
    ,[Longitude],[Postcode],[Country],[Town]) 
    VALUES
    (newid(), 'mbelucci' + CAST(@i as nvarchar(2)), 'monica' + CAST(@i as nvarchar(2)) + '@mail.com', 
    'Monica', 'Belucci', 'xeZeHwXF7CWXdGcZg9cfnw==;nLMydQ9dX1D+pHqviwgt6LgW0GVaYy2UADSi8ZPYG+Q=', 
    null, getdate(), null, null, null, getdate(), 
    null, null, 1, 'Images/dummy.jpg', 
    null, 1, 0, '12-16-1980', 'I like running and watch movies', '["movies", "running", "popcorn"]', 
    34.052235, -118.243683, 90001, 'USA', 'Los Angeles'),

    (newid(), 'rsmith' + CAST(@i as nvarchar(2)), 'rsmith' + CAST(@i as nvarchar(2)) + '@mail.com', 
    'Roland', 'Smith', 'xeZeHwXF7CWXdGcZg9cfnw==;nLMydQ9dX1D+pHqviwgt6LgW0GVaYy2UADSi8ZPYG+Q=', 
    null, getdate(), null, null, null, getdate(), 
    null, null, 1, 'Images/dummy.jpg', 
    null, 0, 1, '01-01-1988', 'I like running and spend time with my friends', '["movies", "friends", "running"]', 
    48.856613, 2.352222, 90001, 'France', 'Paris'),

    (newid(), 'kasmus' + CAST(@i as nvarchar(2)), 'kasmus' + CAST(@i as nvarchar(2)) + '@mail.com', 
    'Kristina', 'Asmus', 'xeZeHwXF7CWXdGcZg9cfnw==;nLMydQ9dX1D+pHqviwgt6LgW0GVaYy2UADSi8ZPYG+Q=', 
    null, getdate(), null, null, null, getdate(), 
    null, null, 1, 'Images/dummy.jpg', 
    null, 1, 0, '01-01-1990', 'I like running and spend time with my friends', '["movies", "friends", "running"]', 
    48.856613, 2.352222, 90001, 'France', 'Paris'),

    (newid(), 'lcarrol' + CAST(@i as nvarchar(2)), 'lcarrol' + CAST(@i as nvarchar(2)) + '@mail.com', 
    'Lika', 'Carrol', 'xeZeHwXF7CWXdGcZg9cfnw==;nLMydQ9dX1D+pHqviwgt6LgW0GVaYy2UADSi8ZPYG+Q=', 
    null, getdate(), null, null, null, getdate(), 
    null, null, 1, 'Images/dummy.jpg', 
    null, 1, 0, '01-01-1999', 'I like running and spend time with my friends', '["sport", "friends", "running"]', 
    48.856613, 2.352222, 90001, 'France', 'Paris'),

    (newid(), 'pfluery' + CAST(@i as nvarchar(2)), 'pfluery' + CAST(@i as nvarchar(2)) + '@mail.com', 
    'Pierre', 'Fleury', 'xeZeHwXF7CWXdGcZg9cfnw==;nLMydQ9dX1D+pHqviwgt6LgW0GVaYy2UADSi8ZPYG+Q=', 
    null, getdate(), null, null, null, getdate(), 
    null, null, 1, 'Images/dummy.jpg', 
    null, 0, 2, '01-01-1995', 'I like running and spend time with my friends', '["sport", "friends", "geek"]', 
    48.856613, 2.352222, 90001, 'France', 'Paris'),

    (newid(), 'ljouli' + CAST(@i as nvarchar(2)), 'ljouli' + CAST(@i as nvarchar(2)) + '@mail.com', 
    'Loran', 'Jouli', 'xeZeHwXF7CWXdGcZg9cfnw==;nLMydQ9dX1D+pHqviwgt6LgW0GVaYy2UADSi8ZPYG+Q=', 
    null, getdate(), null, null, null, getdate(), 
    null, null, 1, 'Images/dummy.jpg', 
    null, 2, 1, '01-01-2000', 'I like running and spend time with my friends', '["sport", "friends", "geek"]', 
    48.856613, 2.352222, 90001, 'France', 'Paris'),

    (newid(), 'ybaque' + CAST(@i as nvarchar(2)), 'ybaque' + CAST(@i as nvarchar(2)) + '@mail.com', 
    'Yasmine', 'Baque', 'xeZeHwXF7CWXdGcZg9cfnw==;nLMydQ9dX1D+pHqviwgt6LgW0GVaYy2UADSi8ZPYG+Q=', 
    null, getdate(), null, null, null, getdate(), 
    null, null, 1, 'Images/dummy.jpg', 
    null, 1, 1, '01-01-2002', 'I like running and spend time with my friends', '["food", "friends", "geek"]', 
    48.856613, 2.352222, 90001, 'France', 'Paris'),

    (newid(), 'ajolie' + CAST(@i as nvarchar(2)), 'ajoli' + CAST(@i as nvarchar(2)) + '@mail.com', 
    'Angelina', 'Jolie', 'xeZeHwXF7CWXdGcZg9cfnw==;nLMydQ9dX1D+pHqviwgt6LgW0GVaYy2UADSi8ZPYG+Q=', 
    null, getdate(), null, null, null, getdate(), 
    null, null, 1, 'Images/dummy.jpg', 
    null, 1, 0, '01-01-1988', 'I like running and spend time with my friends', '["coding", "vegan", "movie"]', 
    48.856613, 2.352222, 90001, 'France', 'Paris'),

    (newid(), 'tkami' + CAST(@i as nvarchar(2)), 'tkami' + CAST(@i as nvarchar(2)) + '@mail.com', 
    'Tamara', 'Kami', 'xeZeHwXF7CWXdGcZg9cfnw==;nLMydQ9dX1D+pHqviwgt6LgW0GVaYy2UADSi8ZPYG+Q=', 
    null, getdate(), null, null, null, getdate(), 
    null, null, 1, 'Images/dummy.jpg', 
    null, 2, 2, '01-01-2000', 'I like running and spend time with my friends', '["coding", "vegan", "movie"]', 
    48.856613, 2.352222, 90001, 'France', 'Paris'),

    (newid(), 'cjambou' + CAST(@i as nvarchar(2)), 'cjambou' + CAST(@i as nvarchar(2)) + '@mail.com', 
    'Clement', 'Jambou', 'xeZeHwXF7CWXdGcZg9cfnw==;nLMydQ9dX1D+pHqviwgt6LgW0GVaYy2UADSi8ZPYG+Q=', 
    null, getdate(), null, null, null, getdate(), 
    null, null, 1, 'Images/dummy.jpg', 
    null, 0, 0, '01-01-1970', 'I like running and spend time with my friends', '["coding", "vegan", "movie"]', 
    48.856613, 2.352222, 90001, 'France', 'Paris')
END;

GO