import { Box, Container, color } from "@mui/system";
import dayjs from "dayjs";
import CancelIcon from "@mui/icons-material/Cancel";
import { alpha, styled } from '@mui/material/styles';
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormLabel,
  Modal,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "../components/LoadingButtonForm";
import { CompleteProfileBody } from "../types/api/accounts";
import { useCompleteProfileMutation } from "../app/api/api";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { Dayjs } from "dayjs";
import OpenStreetMap from "./OpenStreetMap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import HobbiesModal from "../components/HobbiesModal";
import ProfilePicturesUploading from "../components/ProfilePicturesUploading";
import { matchaColors } from "../styles/colors";

export interface AddressData {
  latitude: number;
  longitude: number;
  postCode: string;
  town: string;
  country: string;
}

interface RadioButtonProps {
  value: string;
  label: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ITextField = styled(TextField)({
  '& label.Mui-focused': {
    color: matchaColors.yellow,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E3E7',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: matchaColors.yellow,
    },
  },
});

const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  label,
  name,
  onChange,
}) => {
  return (
    <FormControlLabel
      value={value}
      control={
        <Radio sx={styles.radioButton} name={name} onChange={onChange} />
      }
      label={label}
    />
  );
};

function CompleteProfile() {
  const [completeProfile, { isLoading, isSuccess }] =
    useCompleteProfileMutation();
  const [state, setState] = useState({
    gender: {
      iAmMan: true,
      iAmWoman: false,
      iAmNonBinary: false,
      iSearchMen: true,
      iSearchWomen: false,
      iSearchBoth: false,
    },
  });
  const navigate = useNavigate();
  const [birthday, setBirthday] = useState<Dayjs | null>(dayjs("2000-01-01"));
  const [age, setAge] = useState<number | null>(null);
  const [addressData, setAddressData] = useState<AddressData>({
    latitude: 0,
    longitude: 0,
    postCode: "",
    town: "",
    country: "",
  });
  const [tags, setTags] = useState<string[] | null>(null);
  const [description, setDescription] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [pictures, setPictures] = useState<(File | null)[]>(
    Array.from({ length: 4 }, () => null)
  );

  const handleChangeGender = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      gender: { ...state.gender, [event.target.name]: event.target.checked },
    });
  };

  const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 300) {
      toast.error("You cannot exceed 300 characters for your bio");
      return;
    }
    setDescription(e.target.value);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/home");
    }
  }, [isLoading]);

  const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!profilePicture) {
      toast.error("Profile picture cannot be empty!");
      return;
    } else if (!birthday) {
      toast.error("Birthday cannot be empty!");
      return;
    } else if (!state.gender.iAmMan && !state.gender.iAmWoman) {
      toast.error("Gender cannot be empty!");
      return;
    } else if (!tags || tags?.length < 1) {
      toast.error("You need provide at least one hobbie!");
      return;
    } else if (age !== null && age < 18) {
      toast.error("You need to be at least 18 year old");
      return;
    } else if (age !== null && isNaN(age)) {
      toast.error("Your birthday date is not valid!");
      return;
    }

    const gender: number = state.gender.iAmMan ? 0 : 1;
    let preferedGender: number;

    if (state.gender.iSearchBoth) {
      preferedGender = 2;
    } else if (state.gender.iSearchMen) {
      preferedGender = 0;
    } else if (state.gender.iSearchWomen) {
      preferedGender = 1;
    } else {
      toast.error("Prefered gender cannot be empty!");
      return;
    }

    const res: CompleteProfileBody = {
      profilePicture: profilePicture,
      birthday: birthday.toDate(),
      additionalPictures: pictures.filter(
        (val, i) => val !== null && i !== 0
      ) as File[] | null,
      gender: gender,
      genderPreferences: preferedGender,
      tags: tags,
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
    <Container sx={styles.mainBox}>
      <ProfilePicturesUploading
        profilePicture={profilePicture}
        pictures={pictures}
        setPictures={setPictures}
        setProfilePicture={setProfilePicture}
      />
      <Box sx={styles.dateBox}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            sx={styles.datePicker}
            label={
              age === null || isNaN(age)
                ? "Enter your birthday date here !"
                : `You are ${age} years old`
            }
            value={birthday}
            onChange={(newDate) => {
              setBirthday(newDate);
              setAge(
                Math.abs(
                  new Date(Date.now() - +newDate!.toDate()).getUTCFullYear() -
                    1970
                )
              );
            }}
            maxDate={dayjs()}
            defaultValue={dayjs("2000-01-01")}
          />
        </LocalizationProvider>
      </Box>

      <FormGroup>
        <div style={styles.radioGroup}>
        <div style={styles.selection}>
          <div style={styles.selectionContent}>
            <FormLabel sx={styles.label}>Which gender are you ?</FormLabel>
            <RadioGroup defaultValue="man">
              <RadioButton
                value="man"
                name="iAmMan"
                onChange={handleChangeGender}
                label="Man"
              />
              <RadioButton
                value="woman"
                name="iAmWoman"
                onChange={handleChangeGender}
                label="Woman"
              />
              <RadioButton
                value="nonBinary"
                name="iAmNonBinary"
                onChange={handleChangeGender}
                label="Non Binary"
              />
            </RadioGroup>
          </div>
        </div>

        <div style={styles.selection}>
          <div style={styles.selectionContentSearch}>
            <FormLabel sx={styles.label}>I am searching for :</FormLabel>
            <RadioGroup defaultValue="iSearchMen">
              <RadioButton
                value="iSearchMen"
                name="iSearchMen"
                onChange={handleChangeGender}
                label="Men"
              />
              <RadioButton
                value="iSearchWomen"
                name="iSearchWomen"
                onChange={handleChangeGender}
                label="Women"
              />
              <RadioButton
                value="iSearchBoth"
                name="iSearchBoth"
                onChange={handleChangeGender}
                label="Both"
              />
            </RadioGroup>
          </div>
        </div>
        </div>
      </FormGroup>

      <ITextField
        sx={styles.textfield}
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

      <Box sx={styles.interrestsBox}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button
            variant="contained"
            onClick={() => setOpenModal(!openModal)}
            sx={styles.openModalButton}
          >
            Add an interrest
          </Button>
          <Button
            startIcon={<CancelIcon />}
            onClick={() => setTags([])}
            sx={styles.interrestsFinishedButton}
          >
            Clear all
          </Button>
        </div>
        <div>
          {tags &&
            tags.map((tag) => (
              <Button key={tag} variant="outlined" sx={styles.interrestsButton}>
                {tag}
              </Button>
            ))}
        </div>
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

      <Box sx={styles.locationBox}>
        <FormLabel sx={styles.label}>
          Click on the map to select your location :
        </FormLabel>
        <Box sx={styles.location}>
          <OpenStreetMap setAddressData={setAddressData} />
        </Box>
      </Box>

      <Box sx={{ my: 5 }}>
        <LoadingButton
          sx={styles.savingButton}
          loading={isLoading}
          onClick={handleSubmitClick}
        >
          Saving
        </LoadingButton>
      </Box>
    </Container>
  );
}

const styles = {
  mainBox: {
    display: "flex",
    flexDirection: "column",
    margin: "1%",
  },
  uploadProfileButton: {
    width: "50%",
    height: "70%",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    marginTop: "1%",
    marginBottom: "3%",
  },
  dateBox: {
    padding: "1%",
  },
  datePicker: {
    width: "40%",
    minWidth: "230px",
  },
  bithdayText: {
    paddingBottom: "10px",
    paddingTop: "10px",
    fontWeight: "600",
    fontSize: "large",
  },
  locationText: {
    fontWeight: "600",
  },
  locationBox: {
    padding: "1%",
  },
  location: {
    height: "25vh",
    width: "60vh",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    "@media (max-width: 600px)": {
      width: "90vw",
    },
  },
  openModalButton: {
    marginTop: "1%",
    marginBottom: "1%",
    marginLeft: "3%",
    color: "black",
    backgroundColor: matchaColors.yellow,
    ":hover": {
      backgroundColor: matchaColors.yellowlight,
    },
  },
  modal: {},
  boxModal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "60%",
    height: "70vh",
    minWidth: "320px",
    bgcolor: "rgb(255, 255, 255, 0.9)",
    boxShadow: 24,
    p: 4,
    overflowY: "scroll",
    borderRadius: "10px",
    "@media (max-width: 600px)": {
      width: "90vw",
    },
    "@media (min-width: 601px) and (max-width: 960px)": {
      width: "80vw",
    },
  },
  interrestsText: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "2%",
  },
  interrestsFinishedButton: {
    backgroundColor: matchaColors.light,
    color: matchaColors.text,
    marginLeft: "3%",
    borderRadius: "10px",

  },
  selection: {
    backgroundColor: matchaColors.light,
    padding: "1%",
  },
  selectionContent: {
    color: matchaColors.text,
  },
  selectionContentSearch: {
    color: matchaColors.text,
    margin: 0,
  },
  interrestsBox: {
    display: "flex",
    alignItems: "baseline",
    flexDirection: "column",
    padding: "1%",
  },
  interrestsButton: {
    margin: "1%",
    borderRadius: "20px",
    backgroundColor: "rgb(150, 50, 150)",
    color: "white",
    borderColor: "black",
    cursor: "default",
    ":hover": {
      backgroundColor: "rgb(150, 50, 150)",
      borderColor: "black",
    },
  },
  tickbox: {
    marginLeft: "1%",
  },
  savingButton: {
    backgroundColor: matchaColors.yellow,
  },
  radioGroup: {
    display: "flex",
  },
  radioButton: {
    color: matchaColors.yellow,
    "&.Mui-checked": {
      color: matchaColors.yellowlight,
    },
  },
  label: {
    fontFamily: "Roboto, Arial, Helvetica, sans-serif",
    fontWeight: 900,
  },
  textfield: {
    marginBottom: "1%",
    width: "60%",
    color: matchaColors.yellow
  },
};

export default CompleteProfile;
