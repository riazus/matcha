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
