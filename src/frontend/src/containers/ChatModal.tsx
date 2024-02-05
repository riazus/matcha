import { FormEvent, useState } from "react";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { Typography, Button, Box } from "@mui/material";
import { useAppSelector } from "../app/hooks/hooks";
import MessageDisplay from "../components/MessageDisplay";
import { emitChatConnectionEvent } from "../sockets/chatConnection";
import { ChatEvent } from "../config";
import SendIcon from '@mui/icons-material/Send';

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
      <Box sx={styles.modal}>
        <Box component={Typography} sx={styles.title}>
          Chat
        </Box>
        <MessageDisplay
          currUserId={user!.id}
          interlocutorId={interlocutorId!}
          setChatId={setChatId}
          setMessageText={setMessageText}
          setIsSending={setIsSending}
        />
        <Box sx={styles.sendBox}>
          {/* TODO: Block submit form when messages loading */}
          <form onSubmit={handleSubmit}>
            <fieldset disabled={isSending}>
              <TextField
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write a message..."
                sx={styles.textField}
              ></TextField>
              <Button><SendIcon/></Button>
            </fieldset>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}

const styles = {
  modal: {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  },
  title: {
    pt: "10px",
    pb: "20px",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  sendBox: {
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
    alignItems: "center",
  },
  textField: {
    marginRight: "10px", 
  }
}

export default ChatModal;
