import { memo, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useGetChatMessagesQuery } from "../app/api/api";
import {
  connectChatConnection,
  disconnectChatConnection,
  initializeChatConnection,
} from "../sockets/chatConnection";
import { useAppSelector } from "../app/hooks/hooks";
import {
  chatConnectionListeners,
  removeChatListeners,
} from "../sockets/listeners/chatListeners";

interface MessageDisplayProps {
  currUserId: string;
  interlocutorId: string;
  refreshChatRequested: boolean;
  setChatId: (arg: string) => void;
  setMessageText: (arg: string) => void;
  setIsSending: (arg: boolean) => void;
  setRefreshChatRequested: (arg: boolean) => void;
}

function MessageDisplay(props: MessageDisplayProps) {
  const { user } = useAppSelector((root) => root.user);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: messages,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useGetChatMessagesQuery({
    req: { firstUserId: props.currUserId, secondUserId: props.interlocutorId },
    refreshChatRequested: props.refreshChatRequested,
  });

  useEffect(() => {
    initializeChatConnection(user!.id);
    connectChatConnection();
    chatConnectionListeners();

    return () => {
      removeChatListeners();
      disconnectChatConnection();
    };
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }

    props.setMessageText("");
    props.setIsSending(false);
  }, [messages]);

  useEffect(() => {
    if (!isFetching && !isLoading && isSuccess) {
      props.setChatId(messages.chatId);
      props.setRefreshChatRequested(false);
    }
  }, [isFetching, isLoading, isSuccess]);

  if (isError) {
    return <></>;
  } else if (isLoading || isFetching) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={styles.box} ref={messagesContainerRef}>
        {messages?.messages.map((message, i) => {
          const isUser = message.username === user?.username;
          const messageStyle = isUser ? styles.messageRight : styles.message;
          return (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: isUser ? "flex-end" : "flex-start",
                flexDirection: "column",
                pb: "10px",
                pr: "15px",
              }}
            >
              <Box sx={{alignItems: isUser ? "flex-end" : "flex-start"}}>
                <Typography variant="body1">{message.username}</Typography>
                <Typography variant="caption">
                  {new Date(message.date).toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
              <Box sx={messageStyle}>
                <Typography variant="body2">{message.text}</Typography>
              </Box>
            </Box>
          );
        })}
    </Box>
  );
}

const styles = {
  box: {
    height: "50vh",
    width: "100%",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#ccc #f0f0f0",
  },
  message: {
    backgroundColor: "#f0f0f0",
    padding: "8px",
    borderRadius: "8px",
  },
  messageRight: {
    backgroundColor: "#e6f7ff",
    padding: "8px",
    borderRadius: "8px",
    textAlign: "right",
  },
};

export default memo(MessageDisplay);
