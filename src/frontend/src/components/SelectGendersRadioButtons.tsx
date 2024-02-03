import { FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
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
    <>
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
    </>
  );
}

const styles = {
  selection: {
    backgroundColor: matchaColors.usersBox,
    padding: "1%",
  },
  selectionContentSearch: {
    margin: 0,
  },
  selectionContent: {},
};

export default SelectGendersRadioButtons;
