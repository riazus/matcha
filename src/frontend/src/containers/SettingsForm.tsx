import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  api,
  useChangeProfilePictureMutation,
  useGetSettingsDataQuery,
} from "../app/api/api";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChangePicturesSettings from "./ChangePicturesSettings";
import ChangeProfileSettings from "./ChangeProfileSettings";
import FullScreenLoader from "../components/FullScreenLoader";
import ChangeIdentificationSettings from "../components/ChangeIdentificationSettings";
import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { VisuallyHiddenInput } from "../components/VisuallyHiddenInput";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ChangeLocationSettings from "./ChangeLocationSettings";

const ACCEPTED_IMAGE_TYPES = ".jpeg, .jpg, .png, .webp";

function SettingsForm() {
  const { user } = useAppSelector((root) => root.user);
  const dispatch = useAppDispatch();
  const { data, isLoading, isSuccess } = useGetSettingsDataQuery();
  const [
    updateProfilePicture,
    {
      data: updatePictureResponse,
      isLoading: isUpdatePictureLoading,
      isSuccess: isUpdatePictureSuccess,
    },
  ] = useChangeProfilePictureMutation();

  useEffect(() => {
    if (!isUpdatePictureLoading && isUpdatePictureSuccess) {
      dispatch(
        api.util.updateQueryData("getSettingsData", undefined, (draft) => {
          draft.profilePictureUrl = updatePictureResponse!.profilePictureUrl;
        })
      );
    }
  }, [isUpdatePictureLoading, isUpdatePictureSuccess]);

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      updateProfilePicture(e.target.files[0]);
    }
  };

  if (isLoading) {
    return <FullScreenLoader />;
  } else if (isSuccess) {
    return (
      <Box sx={styles.settingsBox}>
        <div
          style={{
            ...styles.onePictureBox,
            backgroundImage: `url(${data.profilePictureUrl})`,
          }}
        >
          <LoadingButton loading={isUpdatePictureLoading} component="label">
            <DriveFileRenameOutlineIcon />
            <VisuallyHiddenInput
              type="file"
              accept={ACCEPTED_IMAGE_TYPES}
              onChange={(e) => handlePictureUpload(e)}
            />
          </LoadingButton>
        </div>

        <Typography variant="h2" sx={styles.nameText}>
          {user?.firstName} {user?.lastName}
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            📷 Additional pictures
          </AccordionSummary>
          <AccordionDetails>
            <ChangePicturesSettings />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            👤 Profile settings
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

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            🏠 Location settings
          </AccordionSummary>
          <AccordionDetails>
            <ChangeLocationSettings user={user}/>
          </AccordionDetails>
        </Accordion>

        {data.hasPassword && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              🔑 Identification settings
            </AccordionSummary>
            <AccordionDetails>
              <ChangeIdentificationSettings />
            </AccordionDetails>
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
    marginTop: "10px",
    marginBottom: "10px",
  },
  onePictureBox: {
    backgroundColor: "rgb(150, 150, 150, 0.3)",
    height: "25vh",
    width: "15%",
    borderRadius: "10px",
    justifyContent: "center",
    alignItems: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  nameText: {},
};

export default SettingsForm;
