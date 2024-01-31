import { IconButton, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../app/hooks/hooks";
import { Button } from "@mui/base";
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
      notificationConnection?.state === HubConnectionState.Connected
    ) {
      emitNotificationConnectionEvent(
        NotificationEvent.ProfileView,
        formData.id
      );
    }
  }, [notificationConnection, isLoading]);

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

  useEffect(() => {
    setIsLikeLoading(false);
  }, [formData?.isLiked]);

  if (isLoading) {
    return <FullScreenLoader />;
  } else if (isError) {
    return <></>;
  }

  return (
    <>
      <img src={formData!.profilePictureUrl} width={64} height={64} />

      {formData!.isProfilesMatched && (
        <Button onClick={handleOpenChat}>Open chat</Button>
      )}

      {chatOpen && (
        <ChatModal chatOpen={chatOpen} handleCloseChat={handleCloseChat} />
      )}

      <Typography
        textAlign="center"
        component="h1"
        sx={{
          fontWeight: 600,
          fontSize: { xs: "2rem", md: "3rem" },
          color: "#f9d13e",
        }}
      >
        User Profile Here
      </Typography>

      {formData!.isLiked ? (
        <IconButton
          aria-label="like user"
          onClick={handleRemoveLikeClick}
          disabled={isLikeLoading}
        >
          <FavoriteIcon />
        </IconButton>
      ) : (
        <IconButton
          aria-label="dislike user"
          onClick={handleLikeClick}
          disabled={isLikeLoading}
        >
          <FavoriteBorderIcon />
        </IconButton>
      )}
    </>
  );
}

export default UserForm;
