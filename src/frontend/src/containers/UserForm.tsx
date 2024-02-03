import { IconButton, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../app/hooks/hooks";
import { Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import ChatModal from "./ChatModal";
import {
  removeInterlocuterId,
  setInterlocuterId,
} from "../app/slices/currentUserSlice";
import { useGetUserByIdQuery } from "../app/api/api";
import FullScreenLoader from "../components/FullScreenLoader";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  emitNotificationConnectionEvent,
  getNotificationConnection,
} from "../sockets/notificationConnection";
import { HubConnectionState } from "@microsoft/signalr";
import { NotificationEvent } from "../config";
import title from "../styles/title";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";

function UserForm() {
  const { id: idFromParams } = useParams();
  const notificationConnection = getNotificationConnection();
  const dispatch = useAppDispatch();
  const [chatOpen, setChatOpen] = useState(false);
  const handleOpenChat = () => setChatOpen(true);
  const handleCloseChat = () => setChatOpen(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const {
    data: formData,
    isLoading,
    isSuccess,
    isError,
  } = useGetUserByIdQuery(idFromParams!);

  useEffect(() => {
    if (chatOpen) {
      dispatch(setInterlocuterId(idFromParams));
    } else {
      dispatch(removeInterlocuterId());
    }
  }, [chatOpen]);

  useEffect(() => {
    if (
      isSuccess &&
      notificationConnection?.state === HubConnectionState.Connected &&
      !formData.isBlockedByMe &&
      !formData.isBlockedMe
    ) {
      emitNotificationConnectionEvent(
        NotificationEvent.ProfileView,
        formData.id
      );
    }
  }, [notificationConnection, isLoading]);

  useEffect(() => {
    setIsLikeLoading(false);
  }, [formData?.isLiked]);

  const handleLikeClick = () => {
    emitNotificationConnectionEvent(
      NotificationEvent.LikeProfile,
      formData!.id
    );
    setIsLikeLoading(true);
  };

  const handleRemoveLikeClick = () => {
    emitNotificationConnectionEvent(
      NotificationEvent.DislikeProfile,
      formData!.id
    );
    setIsLikeLoading(true);
  };

  const handleBlockProfile = () => {
    emitNotificationConnectionEvent(
      NotificationEvent.BlockProfile,
      formData!.id
    );
  };

  const handleUnblockProfile = () => {
    emitNotificationConnectionEvent(
      NotificationEvent.UnblockProfile,
      formData!.id
    );
  };

  if (isLoading) {
    return <FullScreenLoader />;
  } else if (isError) {
    return <Typography>Error was occured while fetching data</Typography>;
  } else if (formData?.isBlockedMe) {
    return (
      <Typography>
        You cannot see profile of this user, because you are blocked
      </Typography>
    );
  } else if (formData?.isBlockedByMe) {
    return (
      <>
        <Typography>
          You cannot see profile of this user, firstly unblock
        </Typography>
        <Button onClick={handleUnblockProfile}>Unblock profile</Button>
      </>
    );
  }

  return (
    <Box>
      <Box sx={styles.box}>
        <Typography sx={title}>{formData!.username}'s profile</Typography>

        <img src={formData!.profilePictureUrl} width={64} height={64} />

        {formData!.gender === 0 ? <MaleIcon /> : <FemaleIcon />}

        <Box sx={styles.birthday}>{formData!.birthday.toLocaleString()}</Box>

        <Box sx={styles.description}>{formData!.description}</Box>

        {formData!.isProfilesMatched && (
          <Button onClick={handleOpenChat} sx={styles.chatButton}>
            Open chat
          </Button>
        )}
        {chatOpen && (
          <ChatModal chatOpen={chatOpen} handleCloseChat={handleCloseChat} />
        )}

        <Button onClick={handleBlockProfile} sx={styles.blockButton}>
          Block Profile
        </Button>
      </Box>
      {formData!.isLiked ? (
        <IconButton
          aria-label="like user"
          onClick={handleRemoveLikeClick}
          disabled={isLikeLoading}
          sx={styles.likeButton}
        >
          <FavoriteIcon />
        </IconButton>
      ) : (
        <IconButton
          aria-label="dislike user"
          onClick={handleLikeClick}
          disabled={isLikeLoading}
          sx={styles.unlikeButton}
        >
          <FavoriteBorderIcon />
        </IconButton>
      )}
    </Box>
  );
}

const styles = {
  box: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  chatButton: {
    backgroundColor: "#87CEFA",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    padding: "10px 20px",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#6495ED",
    },
  },
  blockButton: {
    backgroundColor: "#ffdddd",
    color: "#ff0000",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ff0000",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(255, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
  },
  description: {
    backgroundColor: "#f8f8f8",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    marginBottom: "20px",
    marginTop: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    height: "20%",
    width: "100%",
  },
  likeButton: {
    backgroundColor: "#FF5A5F", 
    color: "#fff", 
    borderRadius: "12px", 
    padding: "10px 20px",  
    fontSize: "16px", 
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  unlikeButton: {
    backgroundColor: "#FFFFFF", 
    color: "red", 
    borderRadius: "12px", 
    padding: "10px 20px", 
    fontSize: "16px", 
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
  },
  birthday: {

  }
};

export default UserForm;
