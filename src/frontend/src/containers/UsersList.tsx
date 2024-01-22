import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import { useGetUsersWithFiltersQuery } from "../app/api/api";
import FullScreenLoader from "../components/FullScreenLoader";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Filter from "../components/Filter";
import InfiniteScroll from "react-infinite-scroll-component";
import { increaseSearchingPage } from "../app/slices/currentUserSlice";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

function UsersList() {
  const { filter, searchingPage, hasMoreSearchingPage } = useAppSelector(
    (root) => root.user
  );
  const { data, isLoading } = useGetUsersWithFiltersQuery(
    {
      filter,
      page: searchingPage!,
    },
    { skip: !filter }
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const increasePageCount = () => {
    dispatch(increaseSearchingPage());
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
            Users List {data?.length}
          </Typography>
          <Demo>
            <List dense={false}>
              <InfiniteScroll
                dataLength={data?.length ?? 0}
                next={increasePageCount}
                hasMore={hasMoreSearchingPage!}
                loader={<h4>Loading...</h4>}
              >
                {data?.map((user, ind) => {
                  return (
                    <ListItemButton
                      key={ind}
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar src={user.profilePictureUrl}></Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.username}
                        secondary={`${user.town}, ${user.country}`}
                      />
                    </ListItemButton>
                  );
                })}
              </InfiniteScroll>
            </List>
          </Demo>
        </Grid>
      </Grid>
    </>
  );
}

export default UsersList;
