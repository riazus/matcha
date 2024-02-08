import {
  Box,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  List,
} from "@mui/material";
import { AccountsResponse } from "../types/api/accounts";
import { matchaColors } from "../styles/colors";

export default function ProfileViewDisplay({ viewProfiles }: { viewProfiles: AccountsResponse[] | undefined}) {
  return (
    <Box sx={styles.containerBox}>
      <List dense={true}>
        {viewProfiles?.map((item, ind) => {
          return (
            <ListItem key={ind} sx={styles.userList}>
              <ListItemAvatar>
                <Avatar alt={item.username} src={item.profilePictureUrl} />
              </ListItemAvatar>
              <ListItemText primary={item.username} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

const styles = {
  containerBox: {
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginTop: "16px",
    backgroundColor: matchaColors.usersBox,
  },
  userList: {
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
    margin: "5%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
  }
};
