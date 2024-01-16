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
//import InfiniteLoader from "react-window-infinite-loader";
import InfiniteScroll from "react-infinite-scroll-component";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

interface IListRef {
  offsetHeight: number;
}

function UsersList() {
  const [listData, setListData] = useState<PaginationData>({
    page: 0,
    resetListRequested: false,
  });
  const listRef = useRef<HTMLUListElement>(null);
  const filter = useAppSelector((root) => root.filter);
  const { data, isLoading, isFetching } = useGetUsersWithFiltersQuery({
    filter,
    listData,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      // const scrolledToBottom =
      //   window.innerHeight + window.scrollY >= document.body.offsetHeight;
      // if (scrolledToBottom && !isFetching) {
      //   console.log("Fetching more data...");
      //   //setListData((prev) => ({ ...prev, page: prev.page + 1 }));
      // }
      if (listRef.current) {
        console.log(
          `${window.innerHeight + document.documentElement.scrollTop} =?= ${
            document.documentElement.offsetHeight
          }`
        );
      }
    };

    document.addEventListener("scroll", onScroll);

    return function () {
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setListData((prev) => ({ ...prev, resetListRequested: true }));
    }
  }, [filter]);

  useEffect(() => {
    if (listData.resetListRequested) {
      setListData((prev) => ({ ...prev, resetListRequested: false }));
    }
  }, [data]);

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
            <List ref={listRef} dense={false}>
              <InfiniteScroll
                dataLength={data?.length ?? 0}
                next={() =>
                  setListData((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                hasMore={true}
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
