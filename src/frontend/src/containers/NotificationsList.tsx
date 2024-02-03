import { Box } from "@mui/material";
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
import title from "../styles/title";

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
    <Box>
      <Typography sx={title} variant="h6" component="div">
        Notifications List
      </Typography>
        <Box sx={styles.notificationsList}>
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
                    sx={styles.listItem}
                  >
                    <ListItemText primary={item.text} secondary={item.date} />
                  </ListItem>
                );
              })}
            </List>
          </Demo>
      </Box>
    </Box>
  );
}

const styles = {
  notificationsList: {
    marginTop: "16px",
    backgroundColor: '#f0f0f0',
    padding: '16px',
  },
  listItem: {
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
}

export default NotificationsList;
