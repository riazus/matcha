import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Tooltip,
} from "@mui/material";
import { useGetBrowsingUsersWithFiltersQuery, api } from "../app/api/api";
import { Favorite } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks/hooks";
import FullScreenLoader from "../components/FullScreenLoader";
import Filter from "../components/Filter";
import { emitNotificationConnectionEvent } from "../sockets/notificationConnection";
import { NotificationEvent } from "../config";
import { increaseBrowsingPage } from "../app/slices/currentUserSlice";
import { matchaColors } from "../styles/colors";
import {title}from "../styles/textStyles";

function UsersBrowsing() {
  const { filter, browsingPage } = useAppSelector((root) => root.user);
  const { data, isLoading, isFetching } = useGetBrowsingUsersWithFiltersQuery(
    {
      filter: filter ? { ...filter, isForBrowsing: true } : null,
      page: browsingPage!,
    },
    { skip: !filter }
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleBrowsingClick = () => {
    dispatch(
      api.util.updateQueryData(
        "getBrowsingUsersWithFilters",
        { filter, page: browsingPage! },
        (draft) => draft.filter((_, i) => i !== 0)
      )
    );

    if (data?.length === 5) {
      dispatch(increaseBrowsingPage());
    }
  };

  const handleMatchClick = () => {
    emitNotificationConnectionEvent(NotificationEvent.LikeProfile, data![0].id);
    handleBrowsingClick();
  };

  const handleUnmatchClick = () => {
    emitNotificationConnectionEvent(
      NotificationEvent.UnfavoriteProfile,
      data![0].id
    );
    handleBrowsingClick();
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Box sx={styles.container}>
      <Typography sx={title} variant="h6">
        Browse and like/dislike 
      </Typography>
      <Typography sx={styles.userCount} variant="h6">
        Number of Users left: {data?.length}
      </Typography>
      {data && data[0] ? (
        <Box sx={styles.chooseProfileBox}>
          <Button onClick={handleUnmatchClick} sx={styles.dislikeButton}>
            <CloseIcon />
          </Button>
          <Card sx={styles.card}>
            <CardActionArea onClick={() => navigate(`/users/${data[0].id}`)}>
              <CardMedia
                component="img"
                image={data[0].profilePictureUrl}
                alt={data[0].username}
                height="200"
                sx={styles.cardMedia}
              />
              <CardContent>
                <Typography variant="h5">{data[0].username}</Typography>
                <Typography variant="body2" sx={styles.userInfo}>
                  {new Date().getFullYear() -
                    new Date(data[0].birthday).getFullYear()}{" "}
                  years old
                </Typography>
                <Typography variant="body2" sx={styles.userInfo}>
                  {data[0].town}, {data[0].country}
                </Typography>
              </CardContent>
            </CardActionArea>
            <Tooltip title={data[0].description} arrow>
              <InfoIcon sx={styles.infoIcon} />
            </Tooltip>
          </Card>
          <Button onClick={handleMatchClick} sx={styles.likeButton}>
            <Favorite />
          </Button>
        </Box>
      ) : isFetching ? (
        <Typography>Loading...</Typography>
      ) : (
        <Typography>This is the end of the List</Typography>
      )}
      <Box sx={styles.filterContainer}>
        <Filter />
      </Box>
    </Box>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    alignItems: "center",
  },
  userCount: {
    mt: 4,
    mb: 2,
    display: "flex",
    justifyContent: "center",
  },
  chooseProfileBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dislikeButton: {
    margin: "10px",
    borderRadius: "13px",
    background: matchaColors.red,
    color: "black",
    transition: "background 0.3s, color 0.3s, box-shadow 0.3s",
    ':hover': {
      color: "white",
      background: "rgb(240, 50, 50)",
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    }
  },
  likeButton: {
    margin: "10px",
    borderRadius: "13px",
    background: matchaColors.yellow,
    color: matchaColors.red,
    transition: "background 0.3s, color 0.3s, box-shadow 0.3s",
    ':hover': {
      color: "white",
      background: "rgb(240, 50, 50)",
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    }
  },
  card: {
    width: "100%",
    mt: 2,
    position: "relative",
  },
  cardMedia: {
    borderRadius: "20px",
  },
  userInfo: {
    mb: 1,
  },
  infoIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  filterContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10%",
  },
};

export default UsersBrowsing;
