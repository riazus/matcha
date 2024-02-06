import { memo, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
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
    <Grid
      item
      sx={{
        height: "50vh",
        width: "40vh",
        overflowY: "auto",
      }}
      ref={messagesContainerRef}
    >
      {messages?.messages.map((message, i) => {
        return (
          <Grid key={i} container spacing={2} marginBottom={3}>
            <Grid item xs={6} md={6}>
              <Typography variant="body1">{message.username}</Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography variant="caption">
                {new Date(message.date).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">{message.text}</Typography>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default memo(MessageDisplay);
