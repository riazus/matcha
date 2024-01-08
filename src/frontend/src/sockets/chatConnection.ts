import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { API_MESSAGE_HUB_URL } from "../config";

let chatConnection: HubConnection | undefined;

export const initializeChatConnection = (currUserId: string): HubConnection => {
  if (!chatConnection) {
    chatConnection = new HubConnectionBuilder()
      .withUrl(`${API_MESSAGE_HUB_URL}?currUserId=${currUserId}`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.None)
      .build();
  }

  return chatConnection;
};

export const connectChatConnection = () => {
  if (
    chatConnection &&
    chatConnection.state === HubConnectionState.Disconnected
  ) {
    chatConnection
      .start()
      .then(() => {
        console.info("SignalR ChatHub Connected");
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));
  }
};

export const disconnectChatConnection = () => {
  if (chatConnection && chatConnection.state === HubConnectionState.Connected) {
    chatConnection
      .stop()
      .then(() => {
        console.info("SignalR Chat Connection closed");
      })
      .catch((err) => console.error("Can't close SignalR Connection: ", err));
  }
};

export const getChatConnection = (): HubConnection | undefined =>
  chatConnection;

export const emitChatConnectionEvent = (event: string, ...args: any[]) => {
  const connection = getChatConnection();
  if (connection && connection.state === HubConnectionState.Connected) {
    connection.send(event, ...args);
  }
};
