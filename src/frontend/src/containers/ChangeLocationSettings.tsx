import { Box, Typography } from "@mui/material";
import OpenStreetMap from "./OpenStreetMap";
import { Location } from "../types/api/accounts";
import { useAppDispatch, useAppSelector } from "../app/hooks/hooks";
import { useChangeLocationMutation } from "../app/api/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { setLocation } from "../app/slices/currentUserSlice";

function ChangeLocationSettings() {
  const { user } = useAppSelector((root) => root.user);
  const dispatch = useAppDispatch();
  const [changeLocation, { isLoading, isSuccess }] =
    useChangeLocationMutation();
  const [newLocation, setNewLocation] = useState<Location>();

  useEffect(() => {
    if (!isLoading && isSuccess && newLocation) {
      dispatch(
        setLocation({
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
        })
      );

      toast.success(
        `Location successfully changed to ${newLocation.town}, ${newLocation.country}`
      );
    }
  }, [isLoading, isSuccess, newLocation]);

  const handleChangeLocation = (location: Location) => {
    if (
      user?.latitude === location.latitude &&
      user?.longitude === location.longitude
    ) {
      return;
    }

    setNewLocation(location);
    changeLocation(location);
  };

  return (
    <Box sx={styles.locationBox}>
      <Typography>Click on the map to change your location :</Typography>
      <Box sx={styles.location}>
        <OpenStreetMap setAddressData={handleChangeLocation} />
      </Box>
    </Box>
  );
}

const styles = {
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
};

export default ChangeLocationSettings;
