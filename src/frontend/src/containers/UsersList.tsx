import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { useGetUsersWithFiltersQuery } from "../app/api/api";
import FullScreenLoader from "../components/FullScreenLoader";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { PaginationData } from "../types/list/userLists";
import Filter from "../components/Filter";
import InfiniteScroll from "react-infinite-scroll-component";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

function UsersList() {
  const [listData, setListData] = useState<PaginationData>({
    page: 0,
    resetListRequested: false,
  });
  const filter = useAppSelector((root) => root.filter);
  const { data, isLoading, isFetching } = useGetUsersWithFiltersQuery({
    filter,
    listData,
  });
  const navigate = useNavigate();
  const dataLength = useRef(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    return () => {
      dataLength.current = 0;
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setListData({ resetListRequested: true, page: 0 });
    }
  }, [filter]);

  useEffect(() => {
    if (listData.resetListRequested) {
      setListData((prev) => ({ ...prev, resetListRequested: false }));
      setHasMore(true);
      dataLength.current = 0;
    }
  }, [data]);

  useEffect(() => {
    if (data && !isFetching && data.length === dataLength.current) {
      setHasMore(false);
    } else if (data && !isFetching) {
      dataLength.current = data?.length;
    }
  }, [isFetching]);

  const increasePageCount = () =>
    setListData((prev) => ({ ...prev, page: prev.page + 1 }));

  if (isLoading || (isFetching && listData.resetListRequested)) {
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
                hasMore={hasMore}
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
