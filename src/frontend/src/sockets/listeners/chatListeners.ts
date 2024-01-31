import { toast } from "react-toastify";
import { ChatEvent, NotificationEvent } from "../../config";
import { getChatConnection } from "../chatConnection";
import { emitNotificationConnectionEvent } from "../notificationConnection";

export const chatConnectionListeners = () => {
  const connection = getChatConnection();
  if (!connection) return;

  connection.on(ChatEvent.MessageNotValid, (error: string) => {
    toast.error(error);
  });

  connection.on(
    ChatEvent.NotifyInterlocutor,
    (interlocutorId: string, notification: any) => {
      emitNotificationConnectionEvent(
        NotificationEvent.NotifyMessageReceived,
        interlocutorId,
        notification
      );
    }
  );
};

export const removeChatListeners = () => {
  const connection = getChatConnection();
  if (!connection) return;

  connection.off(ChatEvent.MessageNotValid);
  connection.off(ChatEvent.NotifyInterlocutor);
};
