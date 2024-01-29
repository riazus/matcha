import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { API_NOTIFICATION_HUB_URL } from "../config";

let notificationConnection: HubConnection | undefined;

export const initializeNotificationConnection = (
  currUserId: string
): HubConnection => {
  if (!notificationConnection) {
    notificationConnection = new HubConnectionBuilder()
      .withUrl(`${API_NOTIFICATION_HUB_URL}?currUserId=${currUserId}`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.None)
      .build();
  }

  return notificationConnection;
};

export const connectNotificationConnection = () => {
  if (
    notificationConnection &&
    notificationConnection.state === HubConnectionState.Disconnected
  ) {
    notificationConnection
      .start()
      .then(() => {
        console.info("SignalR NotificationHub Connected");
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));
  }
};

export const disconnectNotificationConnection = () => {
  if (
    notificationConnection &&
    notificationConnection.state === HubConnectionState.Connected
  ) {
    notificationConnection
      .stop()
      .then(() => {
        console.info("SignalR Notification Connection closed");
      })
      .catch((err) => console.error("Can't close SignalR Connection: ", err));
  }
};

export const getNotificationConnection = (): HubConnection | undefined =>
  notificationConnection;

export const emitNotificationConnectionEvent = (
  event: string,
  ...args: any[]
) => {
  const connection = getNotificationConnection();
  if (connection && connection.state === HubConnectionState.Connected) {
    connection.send(event, ...args);
  }
};
