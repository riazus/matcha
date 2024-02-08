import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useGetFavoriteProfilesQuery } from "../app/api/api";
import { title } from "../styles/textStyles";
import { useNavigate } from "react-router-dom";
import { matchaColors } from "../styles/colors";

interface Profile {
  username: string;
  id: string;
}


function FavoritesList() {
  const [favorites, setFavorites] = useState<Profile[]>([]);
  const { data, isSuccess } = useGetFavoriteProfilesQuery();

  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      setFavorites(data.map((el) => ({ username: el.username, id: el.id })));
    }
  }, [isSuccess, setFavorites, data]);

  return (
    <Box>
      <Typography sx={title}>My Favorites List</Typography>
      <Box sx={styles.lengthInfo}>
        <Typography sx={styles.lengthText} variant="h6" component="div">
          You have {favorites.length} favorite{" "}
          {favorites.length > 1 ? "profiles" : "profile"} ❤️
        </Typography>
      </Box>
      <Box sx={styles.listBox}>
        <List dense={true}>
          {favorites?.map((item, ind) => {
            return (
              <ListItem
                key={ind}
                sx={styles.listItem}
                onClick={() => navigate(`/users/${item.id}`)}
              >
                <ListItemText primary={item.username} />
              </ListItem>
            );
          })}
        </List>
        </Box>
    </Box>
  );
}

const styles = {
  lengthInfo: {
    backgroundColor: "#f0f0f0",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "16px",
    marginTop: "16px",
  },
  listItem: {
    borderBottom: "1px solid #ccc",
    padding: "16px",
    margin: "2%",
    marginLeft: "5%",
    width: "90%",
    borderRadius: "10px",
    backgroundColor: matchaColors.backgroundlight,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    border: "2px solid black",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#e0e0e0",
      cursor: "pointer",
    },
  },
  lengthText: {
    fontSize: "18px",
  },
  listBox: {
    backgroundColor: matchaColors.darkBox,
    borderRadius: "10%",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    border: "2px solid black"

  }
};

export default FavoritesList;
