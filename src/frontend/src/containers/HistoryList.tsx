import { Grid, Typography } from "@mui/material";
import ViewedProfilesList from "./ViewedProfilesList";
import ProfilesMeViewedList from "./ProfilesMeViewedList";
import { styled } from "@mui/material/styles";
import { useState } from "react";

// TODO: need to change visual representing
export interface Profile {
  username: string;
}

export const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

function HistoryList() {
  const [viewedProfilesCount, setViewedProfilesCount] = useState(0);
  const [profilesMeViewedCount, setProfilesMeViewedCount] = useState(0);

  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          My Views List {viewedProfilesCount}
        </Typography>
      </Grid>
      <ViewedProfilesList setViewedProfilesCount={setViewedProfilesCount} />
      <Grid item xs={12} md={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          Profiles Viewed Me {profilesMeViewedCount}
        </Typography>
      </Grid>
      <ProfilesMeViewedList
        setProfilesMeViewedCount={setProfilesMeViewedCount}
      />
    </Grid>
  );
}

export default HistoryList;
