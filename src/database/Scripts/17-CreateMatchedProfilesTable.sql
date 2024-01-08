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
