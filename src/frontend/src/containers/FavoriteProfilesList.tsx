import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useGetFavoriteProfilesQuery } from "../app/api/api";

// TODO: need to change visual representing
interface Profile {
  username: string;
}

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

function FavoritesList() {
  const [favorites, setFavorites] = useState<Profile[]>([]);
  const { data, isLoading, isSuccess } = useGetFavoriteProfilesQuery();

  useEffect(() => {
    if (isSuccess) {
      setFavorites(data.map((el) => ({ username: el.username })));
    }
  }, [isLoading]);

  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          My Favorites List {favorites.length}
        </Typography>
      </Grid>
      <Demo>
        <List dense={true}>
          {favorites?.map((item, ind) => {
            return (
              <ListItem key={ind}>
                <ListItemText primary={item.username} />
              </ListItem>
            );
          })}
        </List>
      </Demo>
    </Grid>
  );
}

export default FavoritesList;
