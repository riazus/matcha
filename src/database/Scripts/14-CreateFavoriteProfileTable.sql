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
