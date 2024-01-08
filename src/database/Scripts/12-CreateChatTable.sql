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
