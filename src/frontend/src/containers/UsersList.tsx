import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useGetUsersQuery } from "../app/api/api";
import FullScreenLoader from "../components/FullScreenLoader";
import { AccountsResponse } from "../types/api/accounts";
import { useNavigate } from "react-router-dom";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

function UsersList() {
  const [dense, setDense] = React.useState(false);
  const { data, isLoading, isSuccess } = useGetUsersQuery();
  const [users, setUsers] = useState<AccountsResponse[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess && data) {
      setUsers(data);
    }
  }, [isLoading]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          Users List
        </Typography>
        <Demo>
          <List dense={dense}>
            {users?.map((user, ind) => {
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
          </List>
        </Demo>
      </Grid>
    </Grid>
  );
}

export default UsersList;
