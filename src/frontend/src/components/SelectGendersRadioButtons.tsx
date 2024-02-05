import { FormControlLabel, Radio, RadioGroup, Typography, Box } from "@mui/material";
import { Orientation } from "../types/api/accounts";
import { matchaColors } from "../styles/colors";

interface SelectGendersRadioButtonsProps {
  gender: number;
  genderPreferences: number;
  setGender: (orientation: Orientation) => void;
  setGenderPreferences: (orientation: Orientation) => void;
  genderLabel: string;
  genderPreferencesLabel: string;
}

function SelectGendersRadioButtons({
  gender,
  setGender,
  genderLabel,
  genderPreferences,
  setGenderPreferences,
  genderPreferencesLabel,
}: SelectGendersRadioButtonsProps) {
  const handleChangeGender = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(Number.parseInt(event.target.value));
  };

  const handleChangeGenderPreferences = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGenderPreferences(Number.parseInt(event.target.value));
  };

  return (
    <Box sx={styles.containerBox}>
      <div style={styles.selection}>
        <div style={styles.selectionContent}>
          <Typography>{genderLabel}</Typography>
          <RadioGroup value={gender} onChange={handleChangeGender}>
            <FormControlLabel value={0} control={<Radio />} label="Male" />
            <FormControlLabel value={1} control={<Radio />} label="Female" />
            <FormControlLabel
              value={2}
              control={<Radio />}
              label="Non Binary"
            />
          </RadioGroup>
        </div>
      </div>

      <div style={styles.selection}>
        <div style={styles.selectionContentSearch}>
          <Typography>{genderPreferencesLabel}</Typography>
          <RadioGroup
            value={genderPreferences}
            onChange={handleChangeGenderPreferences}
          >
            <FormControlLabel value={0} control={<Radio />} label="Male" />
            <FormControlLabel value={1} control={<Radio />} label="Female" />
            <FormControlLabel
              value={2}
              control={<Radio />}
              label="Non Binary"
            />
          </RadioGroup>
        </div>
      </div>
    </Box>
  );
}

const styles = {
  containerBox: {
    display: "flex",
    marginBottom: "3%",
  },
  selection: {
    backgroundColor: matchaColors.usersBox,
    padding: "2%",
    margin: "1%",
    borderRadius: "10px",
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  selectionContentSearch: {
    margin: 0,
  },
  selectionContent: {},
};

export default SelectGendersRadioButtons;
