import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { api, useGetBrowsingUsersWithFiltersQuery } from "../app/api/api";
import FullScreenLoader from "../components/FullScreenLoader";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks/hooks";
import Filter from "../components/Filter";
import { matchaColors } from "../styles/colors";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Link,
  Tooltip,
} from "@mui/material";
import { Favorite } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { increaseBrowsingPage } from "../app/slices/currentUserSlice";
import InfoIcon from "@mui/icons-material/Info";
import title from "../styles/title";

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
    handleBrowsingClick();
  };

  const handleUnmatchClick = () => {
    handleBrowsingClick();
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "80%" }}>
      <Typography sx={title} variant="h6">
        Browsing page
      </Typography>
      <Typography
        sx={{ mt: 4, mb: 2, display: "flex", justifyContent: "center" }}
        variant="h6"
      >
        Number of Users left : {data?.length}
      </Typography>
      {data && data[0] ? (
        <Box sx={styles.chooseProfileBox}>
          <Button onClick={handleUnmatchClick} sx={styles.dislikeButton}>
            <CloseIcon />
          </Button>
          <Card>
            <CardActionArea>
              <div onClick={() => navigate(`/users/${data[0].id}`)}>
                <CardMedia
                  component="img"
                  image={data[0].profilePictureUrl}
                  height="200"
                  width="150"
                  sx={styles.cardMedia}
                />
              </div>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {data[0].username}
                </Typography>
                <Typography variant="body2">
                  {new Date().getFullYear() -
                    new Date(data[0].birthday).getFullYear()}{" "}
                  years old
                </Typography>
                <Typography variant="body2">
                  {data[0].town}, {data[0].country}
                </Typography>
              </CardContent>
            </CardActionArea>
            <Tooltip title={data[0].description} arrow>
              <InfoIcon />
            </Tooltip>
          </Card>
          <Button onClick={handleMatchClick} sx={styles.likeButton}>
            <Favorite />
          </Button>
        </Box>
      ) : isFetching ? (
        <Typography>Loading...</Typography>
      ) : (
        <Typography>This is end of the List</Typography>
      )}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}
      >
        <Filter />
      </div>
    </Box>
  );
}

const styles = {
  chooseProfileBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  likeButton: {
    background: matchaColors.yellow,
    color: matchaColors.red,
    borderRadius: "20px",
  },
  dislikeButton: {
    borderRadius: "20px",
    background: matchaColors.red,
    color: "black",
  },
  cardMedia: {
    borderRadius: "30px",
  },
};

export default UsersBrowsing;
