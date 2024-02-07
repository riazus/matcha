import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useGetFavoriteProfilesQuery } from "../app/api/api";
import { title } from "../styles/textStyles";
import { useNavigate } from "react-router-dom";

// TODO: need to change visual representing
interface Profile {
  username: string;
  id: string;
}

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

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
      <Demo>
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
      </Demo>
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
    margin: "",
    "&:hover": {
      backgroundColor: "#e0e0e0",
      cursor: "pointer",
    },
  },
  lengthText: {
    fontSize: "18px",
  },
};

export default FavoritesList;
