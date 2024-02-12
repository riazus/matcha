-- Accounts
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
    FameRating INT NOT NULL DEFAULT (0),
    LastConnectionDate DATETIME NULL,
    CONSTRAINT Unique_Username UNIQUE (Username),
    CONSTRAINT Unique_Email UNIQUE (Email)
);
GO