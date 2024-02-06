import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { useGetUsersWithFiltersQuery } from "../app/api/api";
import { Box, Button } from "@mui/material";
import FullScreenLoader from "../components/FullScreenLoader";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks/hooks";
import Filter from "../components/Filter";
import InfiniteScroll from "react-infinite-scroll-component";
import { increaseSearchingPage } from "../app/slices/currentUserSlice";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { useEffect, useState } from "react";
import {title}from "../styles/textStyles";

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

  const [showButton, setShowButton] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Box sx={styles.usersListContent}>
      <Typography sx={title} variant="h6" component="div">
        List of users
      </Typography>
      <Box sx={styles.filterAndUserlistBox}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          {data?.length} users
        </Typography>
        <Filter />
      </Box>
      <div style={{ marginLeft: "10%" }}>
        <List dense={false} sx={styles.list}>
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
                  sx={styles.listItemButton}
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
      </div>
      {showButton && (
        <Button
          onClick={scrollToTop}
          style={{ ...styles.scrollButton, position: "fixed" }}
        >
          <KeyboardDoubleArrowUpIcon />
        </Button>
      )}
    </Box>
  );
}

const styles = {
  list: {},
  usersListContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    alignItems: "stretch",
  },
  filterAndUserlistBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginLeft: "10%",
    marginRight: "10%",
  },
  listItemButton: {
    marginBottom: "1%",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.7)",
    background: "rgb(142, 202, 230, 0.6)",
    borderRadius: "20px",
    marginRight: "10%",
  },
  scrollButton: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    top: "90%",
    left: "90%",
  },
};

export default UsersList;
