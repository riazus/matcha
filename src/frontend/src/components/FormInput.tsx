import {
  FormHelperText,
  Typography,
  FormControl,
  Input,
  InputProps,
} from "@mui/material";
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { matchaColors } from "../styles/colors";

type IFormInputProps = {
  name: string;
  label: string;
} & InputProps;

const FormInput: FC<IFormInputProps> = ({ name, label, ...otherProps }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue=""
      name={name}
      render={({ field }) => (
        <FormControl fullWidth sx={{ mb: 1 }}>
          <Typography variant="body2" sx={styles.text}>
            {label}
          </Typography>
          <Input
            {...field}
            color="success"
            fullWidth
            disableUnderline
            sx={styles.input}
            error={!!errors[name]}
            {...otherProps}
          />
          <FormHelperText error={!!errors[name]}>
            {errors[name] ? (errors[name]?.message as unknown as string) : ""}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};

const styles = {
  text: { color: matchaColors.background, mb: 1, fontWeight: 800, fontSize: "17px" },
  input: { padding: "0.4rem 0.7rem", borderRadius: "1rem", backgroundColor: matchaColors.usersBox, width: "100%" },
};

export default FormInput;
