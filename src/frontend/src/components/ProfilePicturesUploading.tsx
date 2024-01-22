import { Box, Button, FormLabel } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { memo, useMemo } from "react";
import { VisuallyHiddenInput } from "./VisuallyHiddenInput";

const ACCEPTED_IMAGE_TYPES = ".jpeg, .jpg, .png, .webp";

interface ProfilePictureUploadingProps {
  setProfilePicture: React.Dispatch<React.SetStateAction<File | null>>;
  pictures: (File | null)[];
  setPictures: React.Dispatch<React.SetStateAction<(File | null)[]>>;
}

function ProfilePicturesUploading({
  setProfilePicture,
  pictures,
  setPictures,
}: ProfilePictureUploadingProps) {
  const memoPictures = useMemo(() => pictures, [pictures]);

  const handlePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files) {
      var nPictures = [...pictures];
      nPictures[index] = e.target.files[0];
      if (pictures.every((el) => el === null))
        setProfilePicture(e.target.files[0]);
      setPictures(nPictures);
    }
  };

  const suppressPictureUploaded = (index: number) => {
    var nPictures = [...pictures];
    nPictures[index] = null;
    for (let i = 0; i < nPictures.length - 2; i++) {
      if (nPictures[i] === null && nPictures[i + 1] !== null) {
        nPictures[i] = nPictures[i + 1];
        nPictures[i + 1] = null;
      }
    }
    setPictures(nPictures);
    setProfilePicture(nPictures[0]);
  };

  return (
    <div>
      <FormLabel>Please select at least one photo :</FormLabel>
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
    backgroundColor: "rgb(150, 150, 150, 0.3)",
    height: "25vh",
    width: "15%",
    borderRadius: "10px",
    justifyContent: "center",
    alignItems: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
};

export default memo(ProfilePicturesUploading);
