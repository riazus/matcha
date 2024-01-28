import { Box, Container } from "@mui/system";
import dayjs from "dayjs";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  TextField,
  Button,
  FormLabel,
  Modal,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "../components/LoadingButtonForm";
import {
  CompleteProfileBody,
  Location,
  Orientation,
} from "../types/api/accounts";
import { useCompleteProfileMutation } from "../app/api/api";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState, useRef } from "react";
import { Dayjs } from "dayjs";
import OpenStreetMap from "./OpenStreetMap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import HobbiesModal from "../components/HobbiesModal";
import ProfilePicturesUploading from "../components/ProfilePicturesUploading";
import SelectGendersRadioButtons from "../components/SelectGendersRadioButtons";

export interface AddressData {
  latitude: number;
  longitude: number;
  postCode: string;
  town: string;
  country: string;
}

function CompleteProfile() {
  const [completeProfile, { isLoading, isSuccess }] =
    useCompleteProfileMutation();
  const navigate = useNavigate();
  const [gender, setGender] = useState<Orientation>(Orientation.Male);
  const [genderPreferences, setGenderPreferences] = useState<Orientation>(
    Orientation.Male
  );
  const [birthday, setBirthday] = useState<Dayjs | null>(dayjs("2000-01-01"));
  const [age, setAge] = useState<number | null>(null);
  const [addressData, setAddressData] = useState<Location>({
    latitude: 0,
    longitude: 0,
    postcode: "",
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

    const res: CompleteProfileBody = {
      profilePicture: profilePicture,
      birthday: birthday.toDate(),
      additionalPictures: pictures.filter((val) => val !== null) as
        | File[]
        | null,
      gender: gender,
      genderPreferences: genderPreferences,
      tags: tags,
      description: description,
      latitude: addressData.latitude,
      longitude: addressData.longitude,
      postcode: addressData.postcode,
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

      <SelectGendersRadioButtons
        gender={gender}
        genderPreferences={genderPreferences}
        genderLabel="Select your gender"
        genderPreferencesLabel="Select preferred gender"
        setGender={(orientation) => setGender(orientation)}
        setGenderPreferences={(orientation) =>
          setGenderPreferences(orientation)
        }
      />

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
        <FormLabel>Click on the map to select your location :</FormLabel>
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
    backgroundColor: "rgb(253, 255, 252)",
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
    backgroundColor: "rgb(150, 50, 150)",
    ":hover": {
      backgroundColor: "rgb(100, 0, 100)",
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
    marginTop: "3%",
  },
  selection: {
    backgroundColor: "rgb(253, 255, 252)",
    padding: "1%",
  },
  selectionContent: {},
  selectionContentSearch: {
    margin: 0,
  },
  interrestsBox: {
    backgroundColor: "rgb(253, 255, 252)",
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
    backgroundColor: "rgb(150, 50, 150)",
  },
};

export default CompleteProfile;
