import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import OpenStreetMap from "./OpenStreetMap";
import { Location } from "../types/api/accounts";
import { useAppDispatch } from "../app/hooks/hooks";
import { useChangeLocationMutation } from "../app/api/api";
import { useEffect, useState, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { setLocation } from "../app/slices/currentUserSlice";
import { UserState } from "../types/slices/currentUser";

interface LocationSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const IP_API_URL = "https://ipapi.co/json/";

const LocationSwitch: React.FC<LocationSwitchProps> = ({
  checked,
  onChange,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={handleChange} />}
      label="Enable Location"
    />
  );
};

function ChangeLocationSettings({ user }: { user: UserState | null }) {
  const nullAddress = {
    latitude: 0,
    longitude: 0,
    postcode: "",
    town: "",
    country: "",
  };
  const dispatch = useAppDispatch();
  const [changeLocation, { isLoading, isSuccess }] =
    useChangeLocationMutation();
  const [newLocation, setNewLocation] = useState<Location>();
  const [checkedLocation, setCheckedLocation] = useState<boolean>(true);
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

      if (checkedLocation === false)
        toast.success(`Localisation has been disabled`);
      else
        toast.success(
          `Location successfully changed to ${newLocation.town ? newLocation.town : ""} ${newLocation.country}`
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
          }
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
          <Typography>Click on the map to change your location :</Typography>
          <Box sx={styles.location}>
            <OpenStreetMap setAddressData={handleChangeLocation} />
          </Box>
          {newLocation ? (
            <Typography>{`You are located in ${newLocation.town || ""} ${newLocation.country}`}</Typography>
          ) : user?.country ? (
            <Typography>{`You are located in ${user?.town || ""} ${user?.country}`}</Typography>)
            : null
          }
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
    width: "60vh",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    "@media (max-width: 600px)": {
      width: "90vw",
    },
  },
};

export default ChangeLocationSettings;
