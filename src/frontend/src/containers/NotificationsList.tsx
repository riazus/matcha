import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import { useGetNotificationsQuery } from "../app/api/api";
import FullScreenLoader from "../components/FullScreenLoader";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { emitNotificationConnectionEvent } from "../sockets/notificationConnection";
import { NotificationEvent } from "../config";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

function NotificationsList() {
  const {
    data: notifications,
    isLoading,
    isError,
  } = useGetNotificationsQuery();

  const handleDeleteClick = (id: string) => {
    emitNotificationConnectionEvent(NotificationEvent.DeleteNotification, id);
  };

  if (isLoading) {
    return <FullScreenLoader />;
  } else if (isError) {
    return <h1>Error occured while getting notifications</h1>;
  }

  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          Notifications List
        </Typography>
        <Demo>
          <List dense={true}>
            {notifications?.map((item) => {
              return (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteClick(item.id)}
                    >
                      <RemoveRedEyeIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={item.text}
                    // secondary={item.date.toLocaleDateString(undefined, {
                    //   day: "2-digit",
                    //   month: "2-digit",
                    //   year: "numeric",
                    //   hour: "2-digit",
                    //   minute: "2-digit",
                    // })}
                    secondary={item.date}
                  />
                </ListItem>
              );
            })}
          </List>
        </Demo>
      </Grid>
    </Grid>
  );
}

export default NotificationsList;
