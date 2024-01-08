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
