import { Switch, FormControlLabel } from "@mui/material";
import { ChangeEvent } from "react";

interface LocationSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const LocationSwitch: React.FC<LocationSwitchProps> = ({
  checked,
  onChange,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <FormControlLabel
      control={<Switch sx={styles.LocationSwitch} checked={checked} onChange={handleChange} />}
      label="Enable Location"
    />
  );
};

const styles = {
  LocationSwitch: {
    '&.Mui-checked': {
      color: 'yellow',
    },
    track: {
      background: 'yellow',
    },
    thumb: {
      backgroundColor: 'black',
    },
  }
}

export default LocationSwitch;
