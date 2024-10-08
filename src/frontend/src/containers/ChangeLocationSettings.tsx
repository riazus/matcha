import { Box, Typography } from "@mui/material";
import OpenStreetMap from "./OpenStreetMap";
import { Location } from "../types/api/accounts";
import { useAppDispatch } from "../app/hooks/hooks";
import { useChangeLocationMutation } from "../app/api/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  fillFilterDistance,
  resetFilterDistance,
  setLocation,
} from "../app/slices/currentUserSlice";
import { UserState } from "../types/slices/currentUser";
import LocationSwitch from "../components/LocationSwitch";

const IP_API_URL = "https://ipapi.co/json/";

function ChangeLocationSettings({ user }: { user: UserState | null }) {
  const nullAddress = {
    latitude: undefined,
    longitude: undefined,
    postcode: undefined,
    town: undefined,
    country: undefined,
  };
  const dispatch = useAppDispatch();
  const [changeLocation, { isLoading, isSuccess }] =
    useChangeLocationMutation();
  const [newLocation, setNewLocation] = useState<Location>();
  const [checkedLocation, setCheckedLocation] = useState<boolean>(
    !!user?.latitude
  );
  const switchLabel = { inputProps: { "aria-label": "location-switch" } };
  const [ip, setIp] = useState();

  const getIp = async () => {
    const response = await fetch(IP_API_URL);
    const data = await response.json();
    setIp(data.ip);
  };

  useEffect(() => {
    getIp();
  }, []);

  useEffect(() => {
    if (!isLoading && isSuccess && newLocation) {
      dispatch(
        setLocation({
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
          town: newLocation.town,
          country: newLocation.country,
        })
      );

      if (checkedLocation === false) {
        dispatch(resetFilterDistance());
        toast.success(`Location has been disabled`);
      } else if (newLocation.country !== undefined) {
        toast.success(
          `Location successfully changed to ${
            newLocation.town ? newLocation.town : ""
          } ${newLocation.country}`
        );
        dispatch(fillFilterDistance());
      }
    }
  }, [isLoading, isSuccess, newLocation, checkedLocation, dispatch]);

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

  const handleChangeLocationSetting = (checked: boolean) => {
    setCheckedLocation(checked);
    if (checked === false) {
      setNewLocation(nullAddress);
      changeLocation(nullAddress);
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
          setNewLocation(data);
          changeLocation(data);
        })
        .catch((err) => {
          console.log("Request failed:", err);
        });
    }
  };

  return (
    <Box sx={styles.locationBox}>
      <LocationSwitch
        checked={checkedLocation}
        onChange={handleChangeLocationSetting}
        {...switchLabel}
      />
      {checkedLocation === true && (
        <>
          <Typography sx={styles.clickText}>Click on the map to change your location :</Typography>
          <Box sx={styles.location}>
            <OpenStreetMap setAddressData={handleChangeLocation} />
          </Box>
          {newLocation ? (
            <Typography >{`You are located in ${newLocation.town || ""} ${
              newLocation.country
            }`}</Typography>
          ) : user?.country ? (
            <Typography sx={styles.locationText}>{`You are located in ${user?.town || ""} ${
              user?.country
            }`}</Typography>
          ) : null}
        </>
      )}
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
    width: "90%",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  locationText: {
    margin: "5%",
  },
  clickText: {
    margin: "2%",
    fontWeight: "700",
    
  }
};

export default ChangeLocationSettings;
