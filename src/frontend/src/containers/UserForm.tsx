import { IconButton, Typography, Tooltip } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../app/hooks/hooks";
import { Button, Box, Avatar } from "@mui/material";
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
import { title } from "../styles/textStyles";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { matchaColors } from "../styles/colors";
import ScheduledEventsAccordion from "./ScheduledEventsAccordion";
import CreateEventModal from "./CreateEventModal";
import { interrestsButton } from "../styles/textStyles";
import ReactSimplyCarousel from "react-simply-carousel";

function UserForm() {
  const { id: idFromParams } = useParams();
  const notificationConnection = getNotificationConnection();
  const dispatch = useAppDispatch();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [refreshChatRequested, setRefreshChatRequested] = useState(false);
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
  }, [chatOpen, idFromParams, dispatch]);

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
  }, [
    notificationConnection,
    isLoading,
    formData?.id,
    formData?.isBlockedByMe,
    formData?.isBlockedMe,
    isSuccess,
  ]);

  useEffect(() => {
    setIsLikeLoading(false);
  }, [formData?.isLiked]);

  useEffect(() => {
    if (formData?.isProfilesMatched === false) {
      setChatOpen(false);
      setRefreshChatRequested(true);
    }
  }, [formData?.isProfilesMatched]);

  const handleLikeClick = () => {
    emitNotificationConnectionEvent(
      NotificationEvent.LikeProfile,
      formData!.id
    );
    setIsLikeLoading(true);
  };

  const handleOpenChat = () => setChatOpen(true);
  const handleCloseChat = () => setChatOpen(false);
  const handleOpenCreateEvent = () => setCreateEventOpen(true);
  const handleCloseCreateEvent = () => setCreateEventOpen(false);

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
      <Typography sx={{ ...title, fontSize: "28px" }}>
        You cannot see profile of this user, because you are blocked
      </Typography>
    );
  } else if (formData?.isBlockedByMe) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography sx={title}>
          You cannot see profile of this user, firstly unblock
        </Typography>
        <Button onClick={handleUnblockProfile} sx={styles.unblockButton}>
          Unblock profile
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={styles.containerBox}>
      <Box sx={styles.userBox}>
        <Typography sx={title}>{formData!.username}'s profile</Typography>

        <Box sx={styles.avatarBox}>
          <Avatar
            src={formData!.profilePictureUrl}
            sx={{ marginTop: "10px", width: 100, height: 100 }}
          />
          <Box sx={styles.genderAndLocationBox}>
            <Typography sx={styles.locationText}>
              {formData!.town} {formData!.country}
            </Typography>

            {formData!.gender === 0 ? (
              <MaleIcon style={styles.genderIcon} />
            ) : (
              <FemaleIcon style={styles.genderIcon} />
            )}
          </Box>
        </Box>

        <Box sx={styles.birthday}>
          {new Date().getFullYear() -
            new Date(formData!.birthday).getFullYear()}{" "}
          years old
        </Box>

        {formData?.additionalPicturesUrl ? (
          <ReactSimplyCarousel
            activeSlideIndex={activeSlideIndex}
            onRequestChange={setActiveSlideIndex}
            itemsToShow={1}
            itemsToScroll={1}
            forwardBtnProps={{
              //here you can also pass className, or any other button element attributes
              style: {
                alignSelf: "center",
                background: "black",
                border: "none",
                borderRadius: "50%",
                color: "white",
                cursor: "pointer",
                fontSize: "20px",
                height: 30,
                lineHeight: 1,
                textAlign: "center",
                width: 30,
              },
              children: <span>{`>`}</span>,
            }}
            backwardBtnProps={{
              //here you can also pass className, or any other button element attributes
              style: {
                alignSelf: "center",
                background: "black",
                border: "none",
                borderRadius: "50%",
                color: "white",
                cursor: "pointer",
                fontSize: "20px",
                height: 30,
                lineHeight: 1,
                textAlign: "center",
                width: 30,
              },
              children: <span>{`<`}</span>,
            }}
            responsiveProps={[
              {
                itemsToShow: 2,
                itemsToScroll: 2,
                minWidth: 768,
              },
            ]}
            speed={400}
            easing="linear"
          >
            {formData?.additionalPicturesUrl.map((item, index) => (
              <div key={index} style={{ width:300, height: 300, display: "inline-block", position: "relative", overflow: "hidden" }}>
                <img
                  src={item}
                  alt={`Img ${index}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </ReactSimplyCarousel>
        ) : null}

        <Box sx={styles.description}>
          {formData!.description === ""
            ? "No bio provided"
            : formData!.description}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            margin: "2%",
            flexWrap: "wrap",
          }}
        >
          {formData?.tags.map((tag) => (
            <Button sx={interrestsButton}>{tag}</Button>
          ))}
        </Box>

        <Box sx={styles.ButtonBox}>
          {formData!.isProfilesMatched && (
            <>
              <Button onClick={handleOpenChat} sx={styles.chatButton}>
                Open chat
              </Button>
              <Button
                onClick={handleOpenCreateEvent}
                sx={styles.scheduleEventButton}
              >
                Create Event
              </Button>
            </>
          )}
          {formData!.isProfilesMatched && (
            <ScheduledEventsAccordion profileId={formData!.id} />
          )}

          <Button onClick={handleBlockProfile} sx={styles.blockButton}>
            Block Profile
          </Button>
        </Box>
      </Box>

      <Box sx={{ margin: "3%", display: "flex", justifyContent: "center" }}>
        {formData!.isLiked ? (
          <Tooltip title="unlike this profile">
            <span>
              <IconButton
                aria-label="dislike user"
                onClick={handleRemoveLikeClick}
                disabled={isLikeLoading}
                sx={styles.unlikeButton}
              >
                <FavoriteIcon />
              </IconButton>
            </span>
          </Tooltip>
        ) : (
          <Tooltip title="like this profile">
            <span>
              <IconButton
                aria-label="like user"
                onClick={handleLikeClick}
                disabled={isLikeLoading}
                sx={styles.likeButton}
              >
                <FavoriteBorderIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Box>

      {chatOpen && (
        <ChatModal
          chatOpen={chatOpen}
          handleCloseChat={handleCloseChat}
          refreshChatRequested={refreshChatRequested}
          setRefreshChatRequested={setRefreshChatRequested}
        />
      )}

      {createEventOpen && (
        <CreateEventModal
          profileId={formData!.id}
          modalOpen={createEventOpen}
          handleClose={handleCloseCreateEvent}
        />
      )}
    </Box>
  );
}

const baseButtonStyle = {
  borderRadius: "12px",
  padding: "10px 20px",
  fontSize: "16px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const styles = {
  containerBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "2%",
  },
  userBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    backgroundColor: matchaColors.darkBox,
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
  scheduleEventButton: {
    backgroundColor: "#dffa87",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    padding: "10px 20px",
    color: "#28bfcd",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#93db05",
    },
  },
  blockButton: {
    backgroundColor: "#ffdddd",
    color: "#ff0000",
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ff0000",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(255, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
    ":hover": {
      backgroundColor: matchaColors.red,
      color: "black",
    },
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
    ...baseButtonStyle,
    backgroundColor: "#FFFFFF",
    color: "red",
    ":hover": {
      backgroundColor: matchaColors.darkBox,
      color: "rgb(255, 255, 255, 0.2)",
    },
  },
  unlikeButton: {
    ...baseButtonStyle,
    backgroundColor: matchaColors.red,
    color: "white",
    ":hover": {
      backgroundColor: matchaColors.red,
      color: "black",
    },
  },
  birthday: {
    color: matchaColors.yellowlight,
    fontFamily: "Roboto",
    fontWeight: "800",
    fontSize: "2rem",
  },
  unblockButton: {
    color: "black",
    backgroundColor: matchaColors.yellow,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    ":hover": {
      backgroundColor: matchaColors.yellowlight,
    },
  },
  genderIcon: {
    fontSize: "3rem",
  },
  ButtonBox: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    justifyContent: "space-around",
  },
  avatarBox: {
    display: "flex",
    flexDirection: "row",
  },
  genderAndLocationBox: {
    marginLeft: "5%",
  },
  locationText: {
    fontSize: "18px",
    fontWeight: 700,
  },
};

export default UserForm;
