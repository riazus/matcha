import {
  Avatar,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useGetSettingsDataQuery } from "../app/api/api";
import { useAppSelector } from "../app/hooks";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChangePicturesSettings from "./ChangePicturesSettings";
import ChangeProfileSettings from "./ChangeProfileSettings";
import FullScreenLoader from "../components/FullScreenLoader";

function SettingsForm() {
  const { user } = useAppSelector((root) => root.user);
  const { data, isLoading, isSuccess } = useGetSettingsDataQuery();

  if (isLoading) {
    return <FullScreenLoader />;
  } else if (isSuccess) {
    return (
      <Box sx={styles.settingsBox}>
        <Avatar src={data.profilePictureUrl} sx={{ width: 150, height: 150 }} />

        <Typography variant="h2" sx={styles.nameText}>
          {user?.firstName} {user?.lastName}
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Change profile pictures
          </AccordionSummary>
          <AccordionDetails>
            <ChangePicturesSettings />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Change profile settings
          </AccordionSummary>
          <AccordionDetails>
            <ChangeProfileSettings
              profileDataResponse={{
                tags: user!.tags,
                description: data.description,
                gender: data.gender,
                genderPreferences: data.genderPreferences,
              }}
            />
          </AccordionDetails>
        </Accordion>

        {data.hasPassword && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Change identification settings
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
        )}
      </Box>
    );
  } else {
    return <></>;
  }
}

const styles = {
  settingsBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: "75%",
  },
  nameText: {},
};

export default SettingsForm;
