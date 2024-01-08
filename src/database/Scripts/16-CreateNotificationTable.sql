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
