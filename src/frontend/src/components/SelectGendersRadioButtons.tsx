import { FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Orientation } from "../types/api/accounts";

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
  const handleChangeGender = (orientation: Orientation) => {
    setGender(orientation);
  };

  const handleChangeGenderPreferences = (orientation: Orientation) => {
    setGenderPreferences(orientation);
  };

  return (
    <>
      <div style={styles.selection}>
        <div style={styles.selectionContent}>
          <FormLabel>{genderLabel}</FormLabel>
          <RadioGroup>
            <FormControlLabel
              control={
                <Radio onChange={() => handleChangeGender(Orientation.Male)} />
              }
              label="Man"
              checked={gender === Orientation.Male}
            />
            <FormControlLabel
              value="woman"
              control={
                <Radio
                  onChange={() => handleChangeGender(Orientation.Female)}
                />
              }
              label="Woman"
              checked={gender === Orientation.Female}
            />
            <FormControlLabel
              control={
                <Radio
                  onChange={() => handleChangeGender(Orientation.Bisexual)}
                />
              }
              label="Non Binary"
              checked={gender === Orientation.Bisexual}
            />
          </RadioGroup>
        </div>
      </div>

      <div style={styles.selection}>
        <div style={styles.selectionContentSearch}>
          <FormLabel>{genderPreferencesLabel}</FormLabel>
          <RadioGroup>
            <FormControlLabel
              control={
                <Radio
                  onChange={() =>
                    handleChangeGenderPreferences(Orientation.Male)
                  }
                />
              }
              label="Man"
              checked={genderPreferences === Orientation.Male}
            />
            <FormControlLabel
              control={
                <Radio
                  onChange={() =>
                    handleChangeGenderPreferences(Orientation.Female)
                  }
                />
              }
              label="Woman"
              checked={genderPreferences === Orientation.Female}
            />
            <FormControlLabel
              control={
                <Radio
                  onChange={() =>
                    handleChangeGenderPreferences(Orientation.Bisexual)
                  }
                />
              }
              label="Non Binary"
              checked={genderPreferences === Orientation.Bisexual}
            />
          </RadioGroup>
        </div>
      </div>
    </>
  );
}

const styles = {
  selection: {
    backgroundColor: "rgb(253, 255, 252)",
    padding: "1%",
  },
  selectionContentSearch: {
    margin: 0,
  },
  selectionContent: {},
};

export default SelectGendersRadioButtons;
