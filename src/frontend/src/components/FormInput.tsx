import {
  Box,
  FormHelperText,
  Typography,
  FormControl,
  Input,
  InputProps,
  TextField,
  InputAdornment,
  InputLabel,
  IconButton
} from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FC, useState, MouseEvent } from "react";
import { FieldValues, ControllerRenderProps, Controller, useFormContext } from "react-hook-form";

type IFormInputProps = {
  field: ControllerRenderProps<FieldValues, string>;
  name: string;
  label: string;
} & InputProps;

const EmailField : FC<IFormInputProps> = ({name, label, ...otherProps}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <TextField label={label} variant="standard" />
    </Box>
  )
}

const PasswordField : FC<IFormInputProps> = ({name, label, ...otherProps}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <InputLabel htmlFor="standard-adornment-password">{label}</InputLabel>
      <Input
        id="standard-adornment-password"
        type={showPassword ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={e => setShowPassword(!showPassword)}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        /> 
      </div>
  )
}

const InputField : FC<IFormInputProps> = ({name, label, ...otherProps}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
      <TextField label={label} variant="standard" />
    </Box>
  )
}

const DefaultField : FC<IFormInputProps> = ({field, name, label, ...otherProps}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
    <Typography
    variant="body2"
    sx={styles.text}
    >
    {label}
    </Typography>
    <Input
      {...field}
      fullWidth
      disableUnderline
      sx={styles.input}
      error={!!errors[name]}
      {...otherProps}
    />
    </div>
  )
}

const FormInput: FC<IFormInputProps> = ({ name, label, type = "", ...otherProps }) => {
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
          {type === "" ? <DefaultField field={field} name={name} label={label} /> : null}
          {type === "input" ? <InputField field={field} name={name} label={label} /> : null}
          {type === "email" ? <EmailField field={field} name={name} label={label}/> : null}
          {type === "password" ? <PasswordField field={field} name={name} label={label}/> : null}
          <FormHelperText error={!!errors[name]}>
            {errors[name] ? (errors[name]?.message as unknown as string) : ""}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};

const styles = {
  text: {
    color: "#7209b7",
    mb: 1, 
    fontWeight: 600,
    fontFamily: "\"Inter\",sans-serif",
  },
  input: {
    borderRadius: "1rem",
    borderColor: "black",
    borderWidth: "10px",
    backgroundColor: "rgb(114, 9, 183, 0.2)",
    width: "20rem",
    margin: "0.1rem",
    padding: "0.3rem 1rem",
  }
}

export default FormInput;
