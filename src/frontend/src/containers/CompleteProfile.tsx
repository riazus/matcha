import { Box } from "@mui/system";
import dayjs from "dayjs";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/material/styles";
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
import { matchaColors } from "../styles/colors";
import SelectGendersRadioButtons from "../components/SelectGendersRadioButtons";
import LocationSwitch from "../components/LocationSwitch";
import { interrestsButton } from "../styles/textStyles";


const ITextField = styled(TextField)({
  "& label.Mui-focused": {
    color: matchaColors.yellow,
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#B2BAC2",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused fieldset": {
      borderColor: matchaColors.yellow,
    },
  },
});

const IP_API_URL = "https://ipapi.co/json/";

function CompleteProfile() {
  const [completeProfile, { isLoading, isSuccess }] =
    useCompleteProfileMutation();
  const navigate = useNavigate();
  const [gender, setGender] = useState<Orientation>(Orientation.Male);
  const [genderPreferences, setGenderPreferences] = useState<Orientation>(
    Orientation.Male
  );

  const noLocationAddressData = {
    latitude: undefined,
    longitude: undefined,
    postcode: undefined,
    town: undefined,
    country: undefined,
  };
  const [birthday, setBirthday] = useState<Dayjs | null>(dayjs("2000-01-01"));
  const [age, setAge] = useState<number | null>(null);
  const [addressData, setAddressData] = useState<Location>(
    noLocationAddressData
  );
  const [checkedLocation, setCheckedLocation] = useState<boolean>(false);
  const switchLabel = { inputProps: { "aria-label": "location-switch" } };
  const [tags, setTags] = useState<string[] | null>(null);
  const [description, setDescription] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [pictures, setPictures] = useState<(File | null)[]>(
    Array.from({ length: 4 }, () => null)
  );
  const [ip, setIp] = useState();

  const getIp = async () => {
    const response = await fetch(IP_API_URL);
    const data = await response.json();
    setIp(data.ip);
  };

  useEffect(() => {
    getIp();
  }, []);

  const handleChangeLocationSetting = () => {
    setCheckedLocation(!checkedLocation);
    if (checkedLocation === false) {
      setAddressData(noLocationAddressData);
    } else {
      fetch(`https://ipapi.co/${ip}/json`)
        .then((res) => res.json())
        .then((res) => {
          const data = {
            latitude: res.latitude,
            longitude: res.longitude,
            postcode: res.postal,
            town: res.city,
            country: res.country_name,
          };
          setAddressData(data);
        })
        .catch((err) => {
          console.log("Request failed:", err);
        });
    }
  };

  const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 300) {
      return;
    }
    setDescription(e.target.value);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/home", { replace: true });
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
      additionalPictures: pictures.filter(
        (val) => val !== null
      ) as unknown as File[],
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
    <Box sx={styles.mainBox}>
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
      <ProfilePicturesUploading
        profilePicture={profilePicture}
        pictures={pictures}
        setPictures={setPictures}
        setProfilePicture={setProfilePicture}
      />

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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "10px",
          }}
        >
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
            sx={styles.clearAllButton}
          >
            Clear all
          </Button>
        </div>
        <div>
          {tags &&
            tags.map((tag) => (
              <Button key={tag} variant="outlined" sx={interrestsButton}>
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
        <LocationSwitch
          checked={checkedLocation}
          onChange={handleChangeLocationSetting}
          {...switchLabel}
        />
        {checkedLocation && (
          <>
            <FormLabel sx={styles.label}>
              Click on the map to select your location :
            </FormLabel>
            <Box sx={styles.location}>
              <OpenStreetMap setAddressData={setAddressData} />
            </Box>
          </>
        )}
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
    </Box>
  );
}

const styles = {
  mainBox: {
    display: "flex",
    flexDirection: "column",
    width: "90%",
    margin: "7%",
    padding: "2%",
    borderRadius: "10px",
    backgroundColor: matchaColors.darkBox,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    border: "1px solid black",
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
    margin: "2%",
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
  clearAllButton: {
    backgroundColor: matchaColors.darkBox,
    color: matchaColors.text,
    marginLeft: "3%",
    borderRadius: "10px",
    ":hover": {
      background: "rgb(58, 90, 64, 0.8)",
    },
  },
  selection: {
    backgroundColor: matchaColors.backgroundlight,
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
    flexDirection: "column",
    padding: "1%",
    margin: "5%",
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
    color: matchaColors.yellow,
  },
};

export default CompleteProfile;
