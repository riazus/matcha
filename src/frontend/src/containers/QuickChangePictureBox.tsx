import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { VisuallyHiddenInput } from "../components/VisuallyHiddenInput";
import { LoadingButton } from "@mui/lab";
import {
  useDeletePictureMutation,
  useUploadPictureMutation,
} from "../app/api/api";
import { useEffect } from "react";

const ACCEPTED_IMAGE_TYPES = ".jpeg, .jpg, .png, .webp";

interface QuickChangePictureBoxProps {
  index: number;
  picture: (File | null) | string;
  isLastPicture: boolean;
  reduceAdditionalPictures: (index: number) => void;
  increaseAdditionalPictures: (url: string) => void;
}

function QuickChangePictureBox({
  index,
  isLastPicture,
  picture,
  reduceAdditionalPictures,
  increaseAdditionalPictures,
}: QuickChangePictureBoxProps) {
  const [
    uploadPicture,
    { data, isLoading: isUploadLoading, isSuccess: isUploadSuccess },
  ] = useUploadPictureMutation();
  const [
    deletePicture,
    { isLoading: isDeleteLoading, isSuccess: isDeleteSuccess },
  ] = useDeletePictureMutation();

  useEffect(() => {
    if (!isDeleteLoading && isDeleteSuccess) {
      reduceAdditionalPictures(index);
    }
  }, [isDeleteLoading, isDeleteSuccess]);

  useEffect(() => {
    if (!isUploadLoading && isUploadSuccess) {
      increaseAdditionalPictures(data!.pictureUrl);
    }
  }, [isUploadLoading, isUploadSuccess]);

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadPicture(e.target.files[0]);
    }
  };

  const suppressPictureUploaded = () => {
    if (picture && typeof picture === "string") {
      deletePicture(picture.substring(picture.lastIndexOf("/") + 1));
    }
  };

  return (
    <div
      key={index}
      style={{
        ...styles.onePictureBox,
        backgroundImage: picture
          ? `url(${
              typeof picture === "string"
                ? picture
                : URL.createObjectURL(picture)
            })`
          : "none",
      }}
    >
      {!picture && isLastPicture ? (
        <LoadingButton loading={isUploadLoading} component="label">
          <AddCircleOutlineIcon fontSize="large" />
          <VisuallyHiddenInput
            type="file"
            accept={ACCEPTED_IMAGE_TYPES}
            onChange={(e) => handlePictureUpload(e)}
          />
        </LoadingButton>
      ) : picture ? (
        <LoadingButton
          loading={isDeleteLoading}
          onClick={suppressPictureUploaded}
        >
          <RemoveCircleOutlineIcon fontSize="large" />
        </LoadingButton>
      ) : null}
    </div>
  );
}

const styles = {
  onePictureBox: {
    backgroundColor: "rgb(150, 150, 150, 0.3)",
    height: "25vh",
    width: "20%",
    borderRadius: "10px",
    justifyContent: "center",
    alignItems: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
};

export default QuickChangePictureBox;
