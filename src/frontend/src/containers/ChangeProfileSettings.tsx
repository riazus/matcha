import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import HobbiesModal from "../components/HobbiesModal";
import { useEffect, useRef, useState } from "react";
import { Orientation } from "../types/api/accounts";
import { LoadingButton } from "@mui/lab";
import { useUpdateProfileSettingsMutation } from "../app/api/api";
import { toast } from "react-toastify";

interface IProfileSettingsData {
  gender: number;
  genderPreferences: number;
  description: string;
  tags: string[];
}

interface ChangeProfileSettingsProps {
  profileDataResponse: IProfileSettingsData;
}

function ChangeProfileSettings({
  profileDataResponse,
}: ChangeProfileSettingsProps) {
  const [updateProfile, { isLoading, isSuccess }] =
    useUpdateProfileSettingsMutation();
  const [openModal, setOpenModal] = useState(false);
  const [profileData, setProfileData] =
    useState<IProfileSettingsData>(profileDataResponse);
  const [tags, setTags] = useState<string[] | null>(profileDataResponse.tags);

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast.success("Changes saved successfully!");
    }
  }, [isLoading, isSuccess]);

  const handleChangeGender = (
    orientation: Orientation,
    isForPreferences: boolean
  ) => {
    if (isForPreferences) {
      setProfileData((prev) => ({
        ...prev,
        genderPreferences: orientation,
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        gender: orientation,
      }));
    }
  };

  const handleChangeDescription = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfileData((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const handleSubmitChanges = () => {
    if (!tags || tags.length < 1) {
      toast.error("You need provide at least one hobbie");
      return;
    } else if (profileData.description.length < 1) {
      toast.error("Description cannot be empty");
      return;
    }

    updateProfile({
      description: profileData.description,
      gender: profileData.gender,
      genderPreferences: profileData.genderPreferences,
      tags,
    });
  };

  return (
    <Box sx={styles.profileBox}>
      <Box>
        <Typography>Hobbies :</Typography>
        <Box>{tags && tags.map((tag) => <Button key={tag}>{tag}</Button>)}</Box>
        <Button onClick={() => setOpenModal(true)}>
          You can change your hobbies here!
        </Button>
        <Modal
          sx={styles.modal}
          open={openModal}
          onClose={() => setOpenModal(!openModal)}
        >
          <HobbiesModal
            tags={tags}
            setTags={setTags}
            setOpenModal={setOpenModal}
            ref={useRef(null)}
          />
        </Modal>
      </Box>

      <div style={styles.selection}>
        <div style={styles.selectionContent}>
          <FormLabel>Did you change gender ?</FormLabel>
          <RadioGroup>
            <FormControlLabel
              value="man"
              control={
                <Radio
                  name="iAmMan"
                  onChange={() => handleChangeGender(Orientation.Male, false)}
                />
              }
              label="Man"
              checked={profileData.gender === Orientation.Male}
            />
            <FormControlLabel
              value="woman"
              control={
                <Radio
                  name="iAmWoman"
                  onChange={() => handleChangeGender(Orientation.Female, false)}
                />
              }
              label="Woman"
              checked={profileData.gender === Orientation.Female}
            />
            <FormControlLabel
              value="nonBinary"
              control={
                <Radio
                  name="iAmNonBinary"
                  onChange={() =>
                    handleChangeGender(Orientation.Bisexual, false)
                  }
                />
              }
              label="Non Binary"
              checked={profileData.gender === Orientation.Bisexual}
            />
          </RadioGroup>
        </div>
      </div>

      <div style={styles.selection}>
        <div style={styles.selectionContentSearch}>
          <FormLabel>I am searching for :</FormLabel>
          <RadioGroup>
            <FormControlLabel
              value="man"
              control={
                <Radio
                  name="iAmMan"
                  onChange={() => handleChangeGender(Orientation.Male, true)}
                />
              }
              label="Man"
              checked={profileData.genderPreferences === Orientation.Male}
            />
            <FormControlLabel
              value="woman"
              control={
                <Radio
                  name="iAmWoman"
                  onChange={() => handleChangeGender(Orientation.Female, true)}
                />
              }
              label="Woman"
              checked={profileData.genderPreferences === Orientation.Female}
            />
            <FormControlLabel
              value="nonBinary"
              control={
                <Radio
                  name="iAmNonBinary"
                  onChange={() =>
                    handleChangeGender(Orientation.Bisexual, true)
                  }
                />
              }
              label="Non Binary"
              checked={profileData.genderPreferences === Orientation.Bisexual}
            />
          </RadioGroup>
        </div>
      </div>

      <TextField
        sx={{ marginBottom: "1%", width: "60%" }}
        label="Please enter a bio"
        multiline
        rows={6}
        value={profileData.description}
        variant="filled"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <FormLabel sx={{ fontSize: "small" }}>
                {profileData.description
                  ? `${profileData.description.length} characters`
                  : null}
              </FormLabel>
            </InputAdornment>
          ),
        }}
        onChange={(e) => handleChangeDescription(e)}
      />

      <LoadingButton
        loading={isLoading}
        sx={styles.saveButton}
        onClick={handleSubmitChanges}
      >
        Save changes
      </LoadingButton>
    </Box>
  );
}

const styles = {
  profileBox: {
    display: "flex",
    flexDirection: "column",
  },
  selection: {
    backgroundColor: "rgb(253, 255, 252)",
    padding: "1%",
  },
  saveButton: {
    width: "20%",
  },
  selectionContentSearch: {
    margin: 0,
  },
  tickbox: {
    marginLeft: "1%",
  },
  selectionContent: {},
  modal: {},
};

export default ChangeProfileSettings;
