import { useGetPicturesQuery } from "../app/api/api";
import { Box, FormLabel, Typography } from "@mui/material";
import FullScreenLoader from "../components/FullScreenLoader";
import { useEffect, useState } from "react";
import { Pictures } from "../types/api/accounts";
import QuickChangePictureBox from "./QuickChangePictureBox";

function ChangePicturesSettings() {
  const [pictures, setPictures] = useState<Pictures | undefined>();

  const {
    data: profilePictures,
    isLoading,
    isError,
    isSuccess,
  } = useGetPicturesQuery();

  useEffect(() => {
    if (!isLoading && isSuccess) {
      setPictures(profilePictures);
    }
  }, [isLoading, isSuccess, profilePictures]);

  const reduceAdditionalPictures = (index: number) => {
    if (pictures && pictures.additionalPicturesUrl) {
      setPictures((prev) => ({
        ...prev!,
        additionalPicturesUrl: prev!
          .additionalPicturesUrl!.map((url, i) => (i === index ? null : url))
          .sort((a, b) => (a && !b ? -1 : (a && b) || (!a && !b) ? 0 : 1)),
      }));
    }
  };

  const fillWithNewPicture = (url: string) => {
    if (pictures && pictures.additionalPicturesUrl) {
      const ind = pictures.additionalPicturesUrl.findIndex((url) => !url);

      setPictures((prev) => ({
        ...prev!,
        additionalPicturesUrl: prev!.additionalPicturesUrl!.map((prevUrl, i) =>
          i === ind ? url : prevUrl
        ),
      }));
    }
  };

  if (isLoading) {
    return <FullScreenLoader />;
  } else if (isError) {
    return <Typography>Error occured when fetched profile pictures</Typography>;
  } else if (isSuccess && pictures) {
    return (
      <div>
        <Box sx={styles.picturesBox}>
          {pictures.additionalPicturesUrl!.map((picture, index) => (
            <QuickChangePictureBox
              key={index}
              isLastPicture={
                index === 0 ||
                Boolean(pictures.additionalPicturesUrl![index - 1])
              }
              picture={picture}
              index={index}
              reduceAdditionalPictures={reduceAdditionalPictures}
              increaseAdditionalPictures={fillWithNewPicture}
            />
          ))}
        </Box>
      </div>
    );
  } else {
    return <></>;
  }
}

const styles = {
  picturesBox: {
    padding: "1%",
    display: "flex",
    fexDirection: "row",
    gap: "10px",
  },
};

export default ChangePicturesSettings;
