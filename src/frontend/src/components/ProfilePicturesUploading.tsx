import { Box, Button, FormLabel } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { memo, useMemo } from "react";
import { VisuallyHiddenInput } from "./VisuallyHiddenInput";
import { fontFamily } from "@mui/system";

const ACCEPTED_IMAGE_TYPES = ".jpeg, .jpg, .png, .webp";

interface ProfilePictureUploadingProps {
  profilePicture: File | null;
  setProfilePicture: React.Dispatch<React.SetStateAction<File | null>>;
  pictures: (File | null)[];
  setPictures: React.Dispatch<React.SetStateAction<(File | null)[]>>;
}

function ProfilePicturesUploading({
  profilePicture,
  setProfilePicture,
  pictures,
  setPictures,
}: ProfilePictureUploadingProps) {

  const handlePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files) {
      var nPictures = [...pictures];
      nPictures[index] = e.target.files[0];
      setPictures(nPictures);
    }
  };

  const suppressPictureUploaded = (index: number) => {
    var nPictures = [...pictures];
    nPictures[index] = null;
    for (let i = 0; i < nPictures.length - 1; i++) {
      if (nPictures[i] === null && nPictures[i + 1] !== null) {
        nPictures[i] = nPictures[i + 1];
        nPictures[i + 1] = null;
      }
    }
    setPictures(nPictures);
  };

  return (
    <div>
      <FormLabel sx={styles.labelText}>Please select a profile picture :</FormLabel>
      <Box sx={styles.picturesBox}>
          <div
            style={{
              ...styles.onePictureBox,
              backgroundImage:
                profilePicture
                  ? `url(${URL.createObjectURL(profilePicture)})`
                  : "none",
            }}
          >
          <Button component="label">
            <AddCircleOutlineIcon fontSize="large" />
            <VisuallyHiddenInput
              type="file"
              accept={ACCEPTED_IMAGE_TYPES}
              onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
            />
          </Button>
          </div>
      </Box>

      <FormLabel sx={styles.labelText}>You can select additionnal pictures :</FormLabel>
      <Box sx={styles.picturesBox}>
        {pictures.map((picture, index) => (
          <div
            key={index}
            style={{
              ...styles.onePictureBox,
              backgroundImage:
                picture && pictures
                  ? `url(${URL.createObjectURL(picture)})`
                  : "none",
            }}
          >
            {!pictures[index] &&
            (index === 0 || pictures[index - 1]) ? (
              <Button component="label">
                <AddCircleOutlineIcon fontSize="large"/>
                <VisuallyHiddenInput
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES}
                  onChange={(e) => handlePictureUpload(e, index)}
                />
              </Button>
            ) : pictures[index] ? (
              <Button onClick={() => suppressPictureUploaded(index)}>
                <RemoveCircleOutlineIcon fontSize="large" />
              </Button>
            ) : null}
          </div>
        ))}
      </Box>
    </div>
  );
}

const styles = {
  picturesBox: {
    padding: "1%",
    display: "flex",
    fexDirection: "row",
    gap: "10px",
  },
  onePictureBox: {
    backgroundColor: "rgb(255, 255, 255, 0.3)",
    height: "25vh",
    width: "15%",
    borderRadius: "10px",
    justifyContent: "center",
    alignItems: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  labelText: {
    fontWeight: 900,
    fontFamily: "Roboto, Arial, Helvetica, sans-serif",
  },
};

export default memo(ProfilePicturesUploading);
