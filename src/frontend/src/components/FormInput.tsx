import {
  FormHelperText,
  Typography,
  FormControl,
  Input as _Input,
  InputProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { matchaColors } from "../styles/colors";

const Input = styled(_Input)`
  background-color: white;
  padding: 0.4rem 0.7rem;
`;

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
        <FormControl fullWidth sx={{ mb: 2 }}>
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
  input: { borderRadius: "1rem", backgroundColor: matchaColors.usersBox, width: "90%" },
};

export default FormInput;
