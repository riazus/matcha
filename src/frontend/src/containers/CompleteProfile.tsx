import { Box, Container } from "@mui/system";
import { useAppSelector } from "../app/hooks";
import {
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextareaAutosize,
  Input,
  Button,
} from "@mui/material";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { LoadingButton } from "../components/LoadingButtonForm";
import { date, object, string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompleteProfileBody } from "../types/api/accounts";
import { useCompleteProfileMutation } from "../app/api/api";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useRef, useState } from "react";
import UnstyledSelectMultiple from "../components/SelectMultiply";
import { Dayjs } from "dayjs";
import OpenStreetMap from "./OpenStreetMap";
import { toast } from "react-toastify";
import { VisuallyHiddenInput } from "../components/VisuallyHiddenInput";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";

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
  /* "aventure",
  // "timide",
  // "marketing",
  // "fastfood",
  // "intelligence",
  // "humour",
  // "cool",
  // "highTech",
  // "globetrotting",
  // "histoire",
  // "shopping",
  // "nature",
  // "sport",
  // "football",
  // "literature",
  // "math",
  // "action",
  // "faitsDivers",
  // "decouverte",
  // "cinema",
  // "musique",
  // "actualite",
  // "politique",
  // "social",
  // "etudes",
  // "cuisine",
  // "humanitaire",
  // "animaux",
  // "environnement",
  // "jeuxVideo",
  // "peinture",
  // "dessin",
  // "ecriture",
  // "lecture",
  // "photographie",
  // "chasse",
  // "randonnee",
  // "marche",
  // "plage",
  // "detente",
  // "automobile",
  // "couture",
  // "innovation",
  // "terroir",
  // "informatique",
  // "marathon",
   "blogging", */
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
      iAmWomen: false,
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
  const [tags, setTags] = useState<string[] | null>();
  const [description, setDescription] = useState("");

  const handleChangeGender = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      gender: { ...state.gender, [event.target.name]: event.target.checked },
    });
  };

  const handleProfilePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      toast.success("Profile photo submited!");
      setProfilePicture(e.target.files[0]);
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

  const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!profilePicture) {
      toast.error("Profile picture cannot be empty!");
      return;
    } else if (!birthday) {
      toast.error("Birthday cannot be empty!");
      return;
    } else if (!state.gender.iAmMan && !state.gender.iAmWomen) {
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        Upload Profile Picture
        <VisuallyHiddenInput
          type="file"
          accept=".jpg, .png"
          onChange={handleProfilePictureUpload}
        />
      </Button>

      {/* <Box>
          <LoadingButton variant="contained" loading={isLoading}>
            Additional Picture 1
            <input type="file" hidden onSubmit={handleProfilePictureUpload} />
          </LoadingButton>
          <LoadingButton variant="contained" loading={isLoading}>
            Additional Picture 2
            <input type="file" hidden onSubmit={handleProfilePictureUpload} />
          </LoadingButton>
          <LoadingButton variant="contained" loading={isLoading}>
            Additional Picture 3
            <input type="file" hidden onSubmit={handleProfilePictureUpload} />
          </LoadingButton>
          <LoadingButton variant="contained" loading={isLoading}>
            Additional Picture 4
            <input type="file" hidden onSubmit={handleProfilePictureUpload} />
          </LoadingButton>
        </Box> */}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Typography sx={{ mt: 5 }}>
          {birthday?.isValid() &&
            `You are: ${Math.abs(
              new Date(Date.now() - +birthday?.toDate()).getUTCFullYear() - 1970
            )} old`}
        </Typography>
        <DatePicker
          value={birthday}
          onChange={(newDate) => setBirthday(newDate)}
        />
      </LocalizationProvider>

      <FormGroup>
        <Typography sx={{ mt: 5 }}>You are:</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.gender.iAmMan}
              disabled={state.gender.iAmWomen}
              onChange={handleChangeGender}
              name="iAmMan"
            />
          }
          label="I'm a man"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={state.gender.iAmWomen}
              disabled={state.gender.iAmMan}
              onChange={handleChangeGender}
              name="iAmWomen"
            />
          }
          label="I'm a women"
        />
        <Typography>You search:</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.gender.iSearchMan}
              onChange={handleChangeGender}
              name="iSearchMan"
            />
          }
          label="Man"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={state.gender.iSearchWomen}
              onChange={handleChangeGender}
              name="iSearchWomen"
            />
          }
          label="Women"
        />
      </FormGroup>

      <TextareaAutosize
        minRows={3}
        placeholder="Describe yourself"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setDescription(e.target.value)
        }
      />

      <Box sx={{ my: 5 }}>
        <Typography>Select your interests (up 5):</Typography>
        <UnstyledSelectMultiple values={tagsData} setTags={setTags} />
      </Box>

      <Box sx={{ my: 5 }}>
        <Typography color={"white"}>
          Click to the map if you want make location
        </Typography>
        <Box sx={{ height: "50vh", width: "75vh" }}>
          <OpenStreetMap setAddressData={setAddressData} />
        </Box>
      </Box>

      <Box sx={{ my: 5 }}>
        <LoadingButton loading={isLoading} onClick={handleSubmitClick}>
          Save provided information
        </LoadingButton>
      </Box>
    </Box>
  );
}

export default CompleteProfile;
