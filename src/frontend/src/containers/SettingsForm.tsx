import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Input,
  Typography,
} from "@mui/material";
import {
  api,
  useChangeProfilePictureMutation,
  useGetSettingsDataQuery,
  useUpdateNamesMutation,
} from "../app/api/api";
import { useAppDispatch, useAppSelector } from "../app/hooks/hooks";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChangePicturesSettings from "./ChangePicturesSettings";
import ChangeProfileSettings from "./ChangeProfileSettings";
import FullScreenLoader from "../components/FullScreenLoader";
import ChangeIdentificationSettings from "./ChangeIdentificationSettings";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { VisuallyHiddenInput } from "../components/VisuallyHiddenInput";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ChangeLocationSettings from "./ChangeLocationSettings";
import { matchaColors } from "../styles/colors";
import ChangeEmailSettings from "./ChangeEmailSettings";
import { toast } from "react-toastify";

const ACCEPTED_IMAGE_TYPES = ".jpeg, .jpg, .png, .webp";

interface INames {
  firstName: string;
  lastName: string;
}

function SettingsForm() {
  const { user } = useAppSelector((root) => root.user);
  const dispatch = useAppDispatch();
  const [names, setNames] = useState<INames>({ firstName: "", lastName: "" });
  const { data, isLoading, isSuccess } = useGetSettingsDataQuery();
  const [
    updateProfilePicture,
    {
      data: updatePictureResponse,
      isLoading: isUpdatePictureLoading,
      isSuccess: isUpdatePictureSuccess,
    },
  ] = useChangeProfilePictureMutation();
  const [
    updateNames,
    { isLoading: isUpdateNamesLoading, isSuccess: isUpdateNamesSuccess },
  ] = useUpdateNamesMutation();

  useEffect(() => {
    if (isUpdatePictureSuccess) {
      dispatch(
        api.util.updateQueryData("getSettingsData", undefined, (draft) => {
          draft.profilePictureUrl = updatePictureResponse!.profilePictureUrl;
        })
      );
    }
    // eslint-disable-next-line
  }, [isUpdatePictureSuccess]);

  useEffect(() => {
    if (user) {
      setNames({ firstName: user.firstName, lastName: user.lastName });
    }
  }, [user]);

  useEffect(() => {
    if (isUpdateNamesSuccess) {
      toast.success("First and Last names updated successfully!");
    }
  }, [isUpdateNamesSuccess]);

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      updateProfilePicture(e.target.files[0]);
    }
  };

  const handleNamesUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (names.firstName.length < 0 || names.lastName.length < 0) {
      toast.error("First Name and Last Name must be not empty!");
    }

    updateNames(names);
  };

  const handleFirstNameChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.value?.length <= 30) {
      setNames((prev) => ({
        ...prev,
        firstName: e.target.value,
      }));
    }
  };

  const handleLastNameChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.value?.length <= 30) {
      setNames((prev) => ({
        ...prev,
        lastName: e.target.value,
      }));
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
          <LoadingButton
            sx={styles.loadingButton}
            loading={isUpdatePictureLoading}
            component="label"
          >
            <DriveFileRenameOutlineIcon />
            <VisuallyHiddenInput
              type="file"
              accept={ACCEPTED_IMAGE_TYPES}
              onChange={(e) => handlePictureUpload(e)}
            />
          </LoadingButton>
        </div>

        <Typography variant="h2" sx={styles.nameText}>
          {user?.username}
        </Typography>

        <Box sx={styles.nameBox} component="form" onSubmit={handleNamesUpdate}>
          <Input
            sx={{width: "30%", fontWeight: "800"}}
            value={names?.firstName}
            onChange={handleFirstNameChange}
          ></Input>
          <Input
            sx={{marginLeft: "15px", width: "30%",fontWeight: "800"}}
            value={names?.lastName}
            onChange={handleLastNameChange}
          ></Input>
          <LoadingButton type="submit" loading={isUpdateNamesLoading}>
            <DriveFileRenameOutlineIcon sx={{color: matchaColors.yellow}}/>
          </LoadingButton>
        </Box>

        <Accordion sx={styles.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            📷 Additional pictures
          </AccordionSummary>
          <AccordionDetails>
            <ChangePicturesSettings />
          </AccordionDetails>
        </Accordion>

        <Accordion sx={styles.accordion}>
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

        <Accordion sx={styles.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            🏠 Location settings
          </AccordionSummary>
          <AccordionDetails>
            <ChangeLocationSettings user={user} />
          </AccordionDetails>
        </Accordion>

        {data.hasPassword && (
          <>
            <Accordion sx={styles.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                ✉️ Email settings
              </AccordionSummary>
              <AccordionDetails>
                <ChangeEmailSettings />
              </AccordionDetails>
            </Accordion>
            <Accordion sx={styles.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                🔑 Identification settings
              </AccordionSummary>
              <AccordionDetails>
                <ChangeIdentificationSettings />
              </AccordionDetails>
            </Accordion>
          </>
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
    alignItems: "center",
    margin: "3%",
  },
  onePictureBox: {
    backgroundColor: "rgb(150, 150, 150, 0.3)",
    height: "250px",
    width: "250px",
    justifyContent: "center",
    alignItems: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "50%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    margin: "1%",
  },
  nameText: {
    fontWeight: "bold",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
    color: matchaColors.yellowlight,
    margin: "1%",
    fontFamily: "Roboto, sans-serif",
    fontStyle: "italic",
  },
  accordion: {
    width: "70%",
  },
  loadingButton: {
    backgroundColor: matchaColors.yellow,
    borderRadius: "20px",
    ":hover": {
      backgroundColor: matchaColors.yellowlight,
    },
  },
  nameBox: {
    margin: "3%",
    width: "65%",
    display: "flex",
    padding: "1%",
  }
};

export default SettingsForm;
