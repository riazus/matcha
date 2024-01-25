import {
  Avatar,
  Box,
  Button,
  Modal,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  TextField,
  Radio,
  RadioGroup,
  FormLabel,
  InputAdornment,
} from "@mui/material";
import { useEffect, useState, useMemo, useRef } from "react";
import { ProfileBody, Location } from "../types/api/accounts";
import { toast } from "react-toastify";
import { useChangeProfileMutation } from "../app/api/api";
import { useAppSelector } from "../app/hooks";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HobbiesModal from "../components/HobbiesModal";
import ChangePicturesSettings from "./ChangePicturesSettings";

function SettingsForm() {
  const [changeProfile, { isLoading, isError, isSuccess, error }] =
    useChangeProfileMutation();

  const { user } = useAppSelector((root) => root.user);

  const [tags, setTags] = useState<string[] | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const [pictures, setPictures] = useState<(File | null)[] | null>(null);
  const memoPictures = useMemo(() => pictures, [pictures]);
  const [state, setState] = useState({
    gender: {
      iAmMan: true,
      iAmWoman: false,
      iSearchMan: false,
      iSearchWomen: false,
      iSearchBoth: false,
    },
  });
  const [description, setDescription] = useState<string>("");
  const [addressData, setAddressData] = useState<Location>({
    latitude: 0,
    longitude: 0,
    postcode: "",
    town: "",
    country: "",
  });

  useEffect(() => {
    if (user?.id) {
      setTags(user.tags);
    }
  }, [user]);

  const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 300) {
      toast.error("You cannot exceed 300 characters for your bio");
      return;
    }
    setDescription(e.target.value);
  };

  const handleChangeGender = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      gender: { ...state.gender, [event.target.name]: event.target.checked },
    });
  };

  const submitChanges = () => {
    let gender: number;
    let preferedGender: number;

    switch (true) {
      case state.gender.iAmMan:
        gender = 0;
        break;
      case state.gender.iAmWoman:
        gender = 1;
        break;
      default:
        gender = 0;
    }

    if (state.gender.iSearchMan && state.gender.iSearchWomen) {
      preferedGender = 2;
    } else if (state.gender.iSearchMan) {
      preferedGender = 0;
    } else if (state.gender.iSearchWomen) {
      preferedGender = 1;
    } else {
      toast.error("Prefered gender cannot be empty!");
      return;
    }

    const res: ProfileBody = {
      profilePicture: profilePicture,
      additionalPictures:
        pictures !== null ? pictures.filter((file) => file !== null) : null,
      gender: gender,
      genderPreferences: preferedGender,
      tags: tags as string[],
      description: description,
      location: {
        latitude: addressData.latitude,
        longitude: addressData.longitude,
        postcode: addressData.postcode,
        country: addressData.country,
        town: addressData.town,
      },
    };
    console.log("res : ", res);
    changeProfile(res);
  };

  return (
    <Box sx={styles.settingsBox}>
      <Avatar
        src={profilePicture ? URL.createObjectURL(profilePicture as File) : ""}
        sx={{ width: 150, height: 150 }}
      />

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
          <Box sx={styles.profileBox}>
            <Box>
              <Typography>Hobbies :</Typography>
              <Box>
                {user &&
                  tags &&
                  tags.map((tag) => <Button key={tag}>{tag}</Button>)}
              </Box>
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
                <RadioGroup defaultValue="man">
                  <FormControlLabel
                    value="man"
                    control={
                      <Radio name="iAmMan" onChange={handleChangeGender} />
                    }
                    label="Man"
                  />
                  <FormControlLabel
                    value="woman"
                    control={
                      <Radio name="iAmWoman" onChange={handleChangeGender} />
                    }
                    label="Woman"
                  />
                  <FormControlLabel
                    value="nonBinary"
                    control={
                      <Radio
                        name="iAmNonBinary"
                        onChange={handleChangeGender}
                      />
                    }
                    label="Non Binary"
                  />
                </RadioGroup>
              </div>
            </div>

            <div style={styles.selection}>
              <div style={styles.selectionContentSearch}>
                <FormLabel>I am searching for :</FormLabel>
                <div style={styles.tickbox}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.gender.iSearchMan}
                        name="iSearchMan"
                        onChange={handleChangeGender}
                      />
                    }
                    label="Men"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.gender.iSearchWomen}
                        name="iSearchWomen"
                        onChange={handleChangeGender}
                      />
                    }
                    label="Women"
                  />
                </div>
              </div>
            </div>

            <TextField
              sx={{ marginBottom: "1%", width: "60%" }}
              label="Please enter a bio"
              multiline
              rows={6}
              value={description}
              variant="filled"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <FormLabel sx={{ fontSize: "small" }}>
                      {description ? `${description.length} characters` : null}
                    </FormLabel>
                  </InputAdornment>
                ),
              }}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleDescription(e)
              }
            />

            <Button sx={styles.saveButton} onClick={submitChanges}>
              Save changes
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Change identification settings
        </AccordionSummary>
        <AccordionDetails></AccordionDetails>
      </Accordion>
    </Box>
  );
}

const styles = {
  settingsBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: "75%",
  },
  profileBox: {
    display: "flex",
    flexDirection: "column",
  },
  nameText: {},
  modal: {},
  picturesBox: {
    padding: "1%",
    display: "flex",
    fexDirection: "row",
    gap: "10px",
  },
  onePictureBox: {
    backgroundColor: "rgb(150, 150, 150, 0.3)",
    height: "25vh",
    width: "15%",
    borderRadius: "10px",
    justifyContent: "center",
    alignItems: "center",
  },
  selection: {
    backgroundColor: "rgb(253, 255, 252)",
    padding: "1%",
  },
  selectionContent: {},
  selectionContentSearch: {
    margin: 0,
  },
  tickbox: {
    marginLeft: "1%",
  },
  saveButton: {
    width: "20%",
  },
};

export default SettingsForm;
