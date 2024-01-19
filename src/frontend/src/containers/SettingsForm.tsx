import {
  Avatar,
  Box,
  Container,
  Button,
  Modal,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  Radio,
  RadioGroup,
  FormLabel,
  InputAdornment,
} from "@mui/material";
import { useEffect, useState, useMemo, useRef } from "react";
import { CompleteProfileBody } from "../types/api/accounts";
import { toast } from "react-toastify";
import { AccountResponse } from "../types/api/accounts";
import { readUser } from "../app/services/localStorageService";
import { useCompleteProfileMutation } from "../app/api/api";
import { useGetUserByIdQuery } from "../app/api/api";
import { useAppSelector } from "../app/hooks";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HobbiesModal from "../components/HobbiesModal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { VisuallyHiddenInput } from "../components/VisuallyHiddenInput";
import { AddressData } from "../types/api/accounts";

const ACCEPTED_IMAGE_TYPES = ".jpeg, .jpg, .png, .webp";

function SettingsForm() {
  const { user } = useAppSelector((root) => root.user);
  const { data: userInfo } = useGetUserByIdQuery(user!.id) || null;
  const [tags, setTags] = useState<string[] | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [pictures, setPictures] = useState<(File | null)[]>(
    Array.from({ length: 5 }, () => null)
  );
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const memoPictures = useMemo(() => pictures, [pictures]);
  const [state, setState] = useState({
    gender: {
      iAmMan: true,
      iAmWoman: false,
      iSearchMan: false,
      iSearchWomen: false,
    },
  });
  const [description, setDescription] = useState<string>("");
  const [addressData, setAddressData] = useState<AddressData>({
    latitude: 0,
    longitude: 0,
    postCode: "",
    town: "",
    country: "",
  });
  const [completeProfile, { isLoading, isError, isSuccess, error }] =
    useCompleteProfileMutation();

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

  const handlePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files) {
      var nPictures = [...pictures];
      nPictures[index] = e.target.files[0];
      if (nPictures.every((el) => el === null))
        setProfilePicture(e.target.files[0]);
      setPictures(nPictures);
    }
  };

  const suppressPictureUploaded = (index: number) => {
    var nPictures = [...pictures];
    nPictures[index] = null;
    for (let i = 0; i < pictures.length - 2; i++) {
      if (nPictures[i] === null && nPictures[i + 1] !== null) {
        nPictures[i] = nPictures[i + 1];
        nPictures[i + 1] = null;
      }
    }
    setPictures(nPictures);
    setProfilePicture(nPictures[0]);
  };

  useEffect(() => {
    if (!isLoading && !isError && userInfo) {
      setTags(userInfo.tags || null);
      setDescription(userInfo.description);
      console.log(userInfo);
    }
  }, [isLoading, isError, userInfo]);

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

    const res: CompleteProfileBody = {
      profilePicture: profilePicture as File,
      additionalPictures: pictures.slice(1, 5) as File[],
      birthday: userInfo!.birthday,
      gender: gender,
      genderPreferences: preferedGender,
      tags: tags as string[],
      description: description,
      latitude: addressData.latitude,
      longitude: addressData.longitude,
      postcode: addressData.postCode,
      country: addressData.country,
      town: addressData.town,
    };

    completeProfile(res);
  };

  return (
    <Box sx={styles.settingsBox}>
      <Avatar
        src={userInfo?.profilePictureUrl}
        sx={{ width: 150, height: 150 }}
      />
      <Typography variant="h2" sx={styles.nameText}>
        {userInfo?.firstName} {userInfo?.lastName}
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Change profile settings
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={styles.profileBox}>
            <Box sx={styles.picturesBox}>
              {memoPictures.map((picture, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.onePictureBox,
                    backgroundImage:
                      picture && memoPictures
                        ? `url(${URL.createObjectURL(picture)})`
                        : "none",
                  }}
                >
                  {!memoPictures[index] &&
                  (index === 0 || memoPictures[index - 1]) ? (
                    <Button component="label">
                      <AddCircleOutlineIcon fontSize="large" />
                      <VisuallyHiddenInput
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES}
                        onChange={(e) => handlePictureUpload(e, index)}
                      />
                    </Button>
                  ) : memoPictures[index] ? (
                    <Button onClick={() => suppressPictureUploaded(index)}>
                      <RemoveCircleOutlineIcon fontSize="large" />
                    </Button>
                  ) : null}
                </div>
              ))}
            </Box>

            <Box>
              <Typography>Hobbies :</Typography>
              <Box>
                {userInfo &&
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
                      {description.length} characters
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
