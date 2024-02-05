import { Box, Typography } from "@mui/material";
import ViewedProfilesList from "./ViewedProfilesList";
import ProfilesMeViewedList from "./ProfilesMeViewedList";
import { useState } from "react";
import {title}from "../styles/textStyles";

// TODO: need to change visual representing
export interface Profile {
  username: string;
}

function HistoryList() {
  const [viewedProfilesCount, setViewedProfilesCount] = useState(0);
  const [profilesMeViewedCount, setProfilesMeViewedCount] = useState(0);

  return (
    <Box sx={styles.containerBox}>
      <Typography sx={title}>My history</Typography>
      <Box sx={styles.boxGroup}>
      <Box sx={styles.textBox}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          {viewedProfilesCount} {viewedProfilesCount >= 1 ? "Profiles" : "Profile"} I viewed 
        </Typography>
        <ViewedProfilesList setViewedProfilesCount={setViewedProfilesCount} />
      </Box>
      <Box sx={styles.textBox}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          {profilesMeViewedCount} {profilesMeViewedCount >= 1 ? "Profiles" : "Profile"} who viewed me
        </Typography>
        <ProfilesMeViewedList
          setProfilesMeViewedCount={setProfilesMeViewedCount}
        />
      </Box>
      </Box>
    </Box>
  );
}

const styles = {
  containerBox: {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'column',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  textBox: {
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "16px",
  },
  boxGroup: {
    display: "flex",
    flexDirection: "row",
    gap: "20px"
  }
};

export default HistoryList;
