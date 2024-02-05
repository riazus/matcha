IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ScheduleEvent]') AND type in (N'U'))
DROP TABLE [dbo].[ScheduleEvent]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [ScheduleEvent] (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    SenderId UNIQUEIDENTIFIER NOT NULL,
    ReceiverId UNIQUEIDENTIFIER NOT NULL,
    Created DATETIME NOT NULL,
    EventDate DATETIME NOT NULL,
    EventName NVARCHAR(256) NOT NULL,
    Description NVARCHAR(512) NOT NULL,
    FOREIGN KEY (SenderId) REFERENCES Account(Id),
    FOREIGN KEY (ReceiverId) REFERENCES Account(Id)
);
GO
