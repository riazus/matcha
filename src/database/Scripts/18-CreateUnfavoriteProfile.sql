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
