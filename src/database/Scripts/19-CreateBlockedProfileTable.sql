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
