import { FormEvent, useState } from "react";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import { useAppSelector } from "../app/hooks/hooks";
import MessageDisplay from "../components/MessageDisplay";
import { emitChatConnectionEvent } from "../sockets/chatConnection";
import { ChatEvent } from "../config";

const chatStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export interface ChatMessage {
  username: string;
  date: Date;
  content: string;
}

interface ChatModalProps {
  chatOpen: boolean;
  handleCloseChat: () => void;
}

function ChatModal(props: ChatModalProps) {
  const [chatId, setChatId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { user, interlocutorId } = useAppSelector((root) => root.user);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (messageText.length > 0) {
      emitChatConnectionEvent(
        ChatEvent.NewMessage,
        chatId,
        user?.username,
        user?.id,
        interlocutorId,
        messageText
      );

      setIsSending(true);
    }
  };

  return (
    <Modal
      open={props.chatOpen}
      onClose={props.handleCloseChat}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Grid
        container
        sx={chatStyle}
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        minHeight="70vh"
        spacing={3}
      >
        <Grid item component={Typography}>
          Chat
        </Grid>

        <MessageDisplay
          currUserId={user!.id}
          interlocutorId={interlocutorId!}
          setChatId={setChatId}
          setMessageText={setMessageText}
          setIsSending={setIsSending}
        />

        <Grid item>
          {/* TODO: Block submit form when messages loading */}
          <form onSubmit={handleSubmit}>
            <fieldset disabled={isSending}>
              <TextField
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write a message..."
              ></TextField>
              <button>Send</button>
            </fieldset>
          </form>
        </Grid>
      </Grid>
    </Modal>
  );
}

export default ChatModal;
