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
	RelativeAdditionalPicturesUrlDB NVARCHAR(255) NULL,
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