import { Box, Container, display, minWidth, padding } from "@mui/system";
import { useAppSelector } from "../app/hooks";
import dayjs from "dayjs";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Stack,
  Grid,
  Popover,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextareaAutosize,
  TextField,
  Input,
  Button,
  Tooltip,
  Radio,
  RadioGroup,
  FormLabel,
  FormControl,
  Modal,
  Switch,
} from "@mui/material";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { LoadingButton } from "../components/LoadingButtonForm";
import { date, object, string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompleteProfileBody } from "../types/api/accounts";
import { useCompleteProfileMutation } from "../app/api/api";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useRef, useState, SetStateAction } from "react";
import UnstyledSelectMultiple from "../components/SelectMultiply";
import { Dayjs } from "dayjs";
import OpenStreetMap from "./OpenStreetMap";
import { toast } from "react-toastify";
import { VisuallyHiddenInput } from "../components/VisuallyHiddenInput";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import { setColors } from "../styles/colors";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// TAGS DATA ↓↓↓
const tagsData = [
  "food",
  "science",
  "intello",
  "coding",
  "dodo",
  "bio",
  "geek",
  "vegan",
  "artiste",
  "meditation",
  "paresse",
  "fitness",
  "aventure",
  "timide",
  "marketing",
  "fastfood",
  "intelligence",
  "humour",
  "cool",
  "highTech",
  "globetrotting",
  "histoire",
  "shopping",
  "nature",
  "sport",
  "football",
  "literature",
  "math",
  "action",
  "faitsDivers",
  "decouverte",
  "cinema",
  "musique",
  "actualite",
  "politique",
  "social",
  "etudes",
  "cuisine",
  "humanitaire",
  "animaux",
  "environnement",
  "jeuxVideo",
  "peinture",
  "dessin",
  "ecriture",
  "lecture",
  "photographie",
  "chasse",
  "randonnee",
  "marche",
  "plage",
  "detente",
  "automobile",
  "couture",
  "innovation",
  "terroir",
  "informatique",
  "marathon",
  "blogging",
];

function isUser18YearsOrOlder(birthdate: Date): boolean {
  const currentDate = new Date();

  const minBirthdate = new Date(currentDate);
  minBirthdate.setFullYear(minBirthdate.getFullYear() - 18);

  return birthdate <= minBirthdate;
}

// const completeProfileSchema = object({
//   profilePicture: z
//     .any()
//     .refine((file) => !file, "You must upload the main profile picture")
//     .refine((file) => file?.size < MAX_FILE_SIZE, "Max image size is 5MB.")
//     .refine(
//       (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
//       "Only .jpg, .jpeg, .png and .webp formats are supported."
//     ),
//   birthday: date().refine(
//     (date) => isUser18YearsOrOlder(date),
//     "You must be legal age for using this app"
//   ),
// });

export interface AddressData {
  latitude: number;
  longitude: number;
  postCode: string;
  town: string;
  country: string;
}

const registerSchema = object({
  firstName: string().min(1, "First Name is required"),
  lastName: string().min(1, "Last Name is required"),
  username: string().min(1, "Username is required"),
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  confirmPassword: string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

function CompleteProfile() {
  const [completeProfile, { isLoading, isError, isSuccess, error }] =
    useCompleteProfileMutation();

  const methods = useForm<CompleteProfileBody>({
    resolver: zodResolver(registerSchema),
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;
  const [state, setState] = useState({
    gender: {
      iAmMan: false,
      iAmWoman: false,
      iSearchMan: false,
      iSearchWomen: false,
    },
    years: {
      yearsOld: null,
      birthday: Date,
    },
  });
  const navigate = useNavigate();
  const [birthday, setBirthday] = useState<Dayjs | null>(null);
  const [addressData, setAddressData] = useState<AddressData>({
    latitude: 0,
    longitude: 0,
    postCode: "",
    town: "",
    country: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [pictures, setPictures] = useState<(File | null)[]>(
    Array.from({ length: 5 }, () => null)
  );
  const [tags, setTags] = useState<string[] | null>();
  const [description, setDescription] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleChangeGender = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      gender: { ...state.gender, [event.target.name]: event.target.checked },
    });
  };

  const handleTag = (tag: string) => {
    if (tags?.find((x) => x === tag) !== undefined) {
      const nTags = tags?.filter((oneTag) => oneTag !== tag);
      setTags(nTags);
    } else {
      setTags((prevTags: string[] | null | undefined) =>
        prevTags ? [...prevTags, tag] : [tag]
      );
    }
  };

  const handleProfilePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      toast.success("Profile photo submited!");
      setProfilePicture(e.target.files[0]);
    }
  };

  const handlePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files) {
      toast.success("photo submited!");
      var nPictures = [...pictures];
      nPictures[index] = e.target.files[0];
      setPictures(nPictures);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }

    // TODO: Delete this error handler (look rtkQueryErrorMiddleware.tsx)
    if (isError) {
      if ((error as any).error) {
        toast.error((error as any).error);
      } else if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) => toast.error(el.message));
      } else {
        toast.error((error as any).data.message);
      }
    }
  }, [isLoading]);

  useEffect(() => {
    console.log("pictures :>> ", pictures);
  }, [pictures]);

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
    }

    const gender: number = state.gender.iAmMan ? 0 : 1;
    let preferedGender: number;

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
      profilePicture: profilePicture,
      birthday: birthday.toDate(),
      additionalPictures: null,
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

    //console.log(res);
    completeProfile(res);
  };

  return (
    <Container sx={styles.mainBox}>
      <div>
        <FormLabel>Please select at least one photo :</FormLabel>
        <Box sx={styles.picturesBox}>
          {pictures.map((picture, index) => (
            <div
              key={index}
              style={{
                ...styles.onePictureBox,
                backgroundImage: picture
                  ? `url(${URL.createObjectURL(picture)})`
                  : "none",
              }}
            >
              {picture ? null : (
                <Button component="label">
                  <AddCircleOutlineIcon fontSize="large" />
                  <VisuallyHiddenInput
                    type="file"
                    accept=".jpg, .png, .jpeg, .webp"
                    onChange={(e) => handlePictureUpload(e, index)}
                  />
                </Button>
              )}
            </div>
          ))}
        </Box>
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={styles.datePicker}
          label="Enter your birthday date here !"
          value={birthday}
          onChange={(newDate) => {
            setBirthday(newDate);
          }}
          maxDate={dayjs()}
          defaultValue={dayjs("2000-01-01")}
        />
        <Typography style={styles.bithdayText} sx={{ mt: 5 }}>
          {birthday?.isValid() &&
            `You are: ${Math.abs(
              new Date(Date.now() - +birthday?.toDate()).getUTCFullYear() - 1970
            )} old`}
        </Typography>
      </LocalizationProvider>

      <FormGroup>
        <div style={styles.selection}>
          <div style={styles.selectionContent}>
            <FormLabel>Which gender are you ?</FormLabel>
            <RadioGroup defaultValue="man">
              <FormControlLabel
                value="man"
                control={<Radio name="iAmMan" onChange={handleChangeGender} />}
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
                  <Radio name="iAmNonBinary" onChange={handleChangeGender} />
                }
                label="Non Binary"
              />
              <FormControlLabel
                value="other"
                control={<Radio name="other" onChange={handleChangeGender} />}
                label="Not represented !"
              />
            </RadioGroup>
          </div>
        </div>
        <div style={styles.selection}>
          <div style={styles.selectionContent}>
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
      </FormGroup>

      <TextField
        sx={{ marginTop: "1%", marginBottom: "1%" }}
        label="Please enter a bio"
        multiline
        rows={6}
        variant="filled"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setDescription(e.target.value)
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
          <Box sx={styles.boxModal}>
            <Typography variant="h1" sx={styles.interrestsText}>
              Interrests :
            </Typography>
            <Grid container spacing={2}>
              {tagsData.map((tag) => (
                <Grid key={tag} item xs={10} sm={4}>
                  <Button
                    onClick={() => handleTag(tag)}
                    color="secondary"
                    variant={
                      tags && tags.includes(tag) === true
                        ? "contained"
                        : "outlined"
                    }
                  >
                    {tag}
                  </Button>
                </Grid>
              ))}
            </Grid>
            <Button
              onClick={() => setTags([])}
              sx={styles.interrestsFinishedButton}
            >
              Clear all
            </Button>
            <Button
              onClick={() => setOpenModal(!openModal)}
              sx={styles.interrestsFinishedButton}
            >
              Finished
            </Button>
          </Box>
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
  datePicker: {
    width: "40%",
    minWidth: "230px",
  },
  bithdayText: {
    paddingBottom: "10px",
    paddingTop: "10px",
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
