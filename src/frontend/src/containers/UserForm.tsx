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
import BlockAndReportButtons from "./BlockAndReportButtons";
import { useTheme } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import MobileStepper from '@mui/material/MobileStepper';


function UserForm() {
  const { id: idFromParams } = useParams();
  const notificationConnection = getNotificationConnection();
  const dispatch = useAppDispatch();
  const [chatOpen, setChatOpen] = useState(false);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [refreshChatRequested, setRefreshChatRequested] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const theme = useTheme();
  const {
    data: formData,
    isLoading,
    isSuccess,
    isError,
  } = useGetUserByIdQuery(idFromParams!);
  const [activeStep, setActiveStep] = useState<number>(0);
  const maxSteps = formData?.additionalPicturesUrl === null ? 0 : formData?.additionalPicturesUrl.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };


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

        <Box>
          <Typography sx={styles.nameText}>
            {formData!.firstName} {formData!.lastName}
          </Typography>
        </Box>

        <Box sx={styles.avatarBox}>
          <Avatar
            src={formData!.profilePictureUrl}
            sx={{ marginTop: "10px", width: 100, height: 100 }}
          />
          <Box sx={styles.genderAndLocationBox}>
            <Typography sx={styles.locationText}>
              {formData!.town ?? ""} {formData!.country ?? ""}
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

        {formData!.additionalPicturesUrl && formData!.additionalPicturesUrl.length !== 0?
          <Box sx={styles.stepperBox}>
            <Box sx={styles.imgBox}>
              <img
                src={formData!.additionalPicturesUrl[activeStep]}
                alt={`Image ${activeStep}`}
                style={styles.img}
              />
            </Box>
            <MobileStepper
              key={`stepper-${maxSteps}`}
              variant="text"
              steps={maxSteps ? maxSteps : 0}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  key={`nextButton-${activeStep}`}
                  size="small"
                  onClick={handleNext}
                  disabled={maxSteps ? activeStep === maxSteps - 1 : true}
                >
                  Next
                  {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </Button>
              }
              backButton={
                <Button key={`backButton-${activeStep}`} size="small" onClick={handleBack} disabled={activeStep === 0}>
                  {theme.direction === 'rtl' ? (
                    <KeyboardArrowRight />
                  ) : (
                    <KeyboardArrowLeft />
                  )}
                  Back
                </Button>
              }
            />
          </Box> : null}

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
          {formData?.tags.map((tag, index) => (
            <Button key={`tag-${index}`} sx={interrestsButton}>{tag}</Button>
          ))}
        </Box>
        <BlockAndReportButtons profileId={formData!.id} />

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
    fontFamily: "Roboto",
    fontWeight: "800",
    fontSize: "15px",
    margin: "2%"
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
    marginLeft: "10%",
    marginTop: "10%"
  },
  locationText: {
    fontFamily: "Roboto",
    fontSize: "18px",
    fontWeight: 700,
  },
  nameText: {
    fontFamily: "Roboto",
    margin: "3%",
    fontSize: "20px",
    fontWeight: "700",
    width: "100%"
  },
  stepperBox: {
    height: "100%",
    border: "1px solid black",
    boxShadow: "5px 5px black"
  },
  imgBox: {  
    width: '100%',
    height: "100%",
    p: 0.5
  },
  img: {
    width: '100%', 
    height: '100%',
  }
};

export default UserForm;
