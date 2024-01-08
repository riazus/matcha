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
