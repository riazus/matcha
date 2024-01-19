import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { api, useGetBrowsingUsersWithFiltersQuery } from "../app/api/api";
import FullScreenLoader from "../components/FullScreenLoader";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Filter from "../components/Filter";
import { Box, Button, Link } from "@mui/material";
import { Favorite } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { increaseBrowsingPage } from "../app/slices/currentUserSlice";

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
    <>
      <Filter />
      <Grid container>
        <Grid item xs={12} md={6}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Browsing Users {data?.length}
          </Typography>
          {data && data[0] ? (
            <Box sx={styles.chooseProfileBox}>
              <Button onClick={handleUnmatchClick}>
                <CloseIcon />
              </Button>
              <Link
                component="button"
                onClick={() => navigate(`/users/${data[0].id}`)}
              >
                <Avatar src={data[0].profilePictureUrl}></Avatar>
              </Link>
              <Typography variant="h3">{data[0].username}</Typography>
              <Button onClick={handleMatchClick}>
                <Favorite />
              </Button>
            </Box>
          ) : isFetching ? (
            <Typography>Loading...</Typography>
          ) : (
            <Typography>This is end of the List</Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
}

const styles = {
  chooseProfileBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
};

export default UsersBrowsing;
