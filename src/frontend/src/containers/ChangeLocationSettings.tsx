import { Box, FormLabel } from "@mui/material";
import OpenStreetMap from "./OpenStreetMap";
import { Location } from "../types/api/accounts";
import { useAppSelector } from "../app/hooks";
import { useChangeLocationMutation } from "../app/api/api";
import { useEffect } from "react";
import { toast } from "react-toastify";

function ChangeLocationSettings() {
  const { user } = useAppSelector((root) => root.user);
  const [changeLocation, { data, isLoading, isSuccess }] =
    useChangeLocationMutation();

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast.success(
        `Location successfully changed to ${data?.town}, ${data?.country}`
      );
    }
  }, [isLoading, isSuccess, data]);

  const handleChangeLocation = (location: Location) => {
    if (
      user?.latitude === location.latitude &&
      user?.longitude === location.longitude
    ) {
      return;
    }

    changeLocation(location);
  };

  return (
    <Box sx={styles.locationBox}>
      <FormLabel>Click on the map to change your location :</FormLabel>
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
