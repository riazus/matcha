import { useRegisterMutation } from "../app/api/api";
import { Box, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { RegisterBody } from "../types/api/accounts";
import { useEffect } from "react";
import { toast } from "react-toastify";
import FormInput from "../components/FormInput";
import { LinkItem } from "../components/LinkItemForm";
import { LoadingButton } from "../components/LoadingButtonForm";

const registerSchema = object({
  firstName: string().min(1, "First Name is required"),
  lastName: string().min(1, "Last Name is required"),
  username: string().min(1, "Username is required"),
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  confirmPassword: string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

function RegisterForm() {
  const methods = useForm<RegisterBody>({
    resolver: zodResolver(registerSchema),
  });

  const [registerUser, { isLoading, isSuccess, data }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message);
    }
  }, [isLoading]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmitForm: SubmitHandler<RegisterBody> = (values) => {
    registerUser(values);
  };

  return (
    <Box sx={styles.registerBox}>
      <Typography textAlign="center" component="h1" sx={styles.matchaText}>
        Welcome to Matcha!
      </Typography>
      <Typography component="h2" sx={styles.signupText}>
        Sign Up To Get Started!
      </Typography>
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmitForm)} noValidate>
          <FormInput name="firstName" label="First Name" />
          <FormInput name="lastName" label="Last Name" />
          <FormInput name="username" label="Username" />
          <FormInput name="email" label="Email" type="email" />
          <FormInput name="password" label="Password" type="password" />
          <FormInput
            name="confirmPassword"
            label="Confirm Password"
            type="password"
          />

          <Typography sx={styles.alreadyHaveAccountText}>
            Already have an account? <LinkItem to="/login">Login Here</LinkItem>
          </Typography>

          <LoadingButton
            variant="contained"
            sx={styles.signupButton}
            fullWidth
            disableElevation
            type="submit"
            loading={isLoading}
          >
            Sign Up
          </LoadingButton>
        </Box>
      </FormProvider>
    </Box>
  );
}

const styles = {
  matchaText: {
    color: "#00b4d8",
    fontSize: { xs: "2rem", md: "3rem" },
    fontWeight: 600,
    m: 2,
    letterSpacing: 1,
  },
  registerBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  formBox: {
    borderRadius: "10px",
    backgroundColor: "rgb(113, 97, 239, 0.2)",
    borderWidth: "10px",
    padding: "10px",
    margin: "10px",
  },
  signupText: {
    color: "#e0aaff",
    mb: 2,
  },
  alreadyHaveAccountText: {
    fontSize: "0.9rem",
    mb: "1rem",
    textAlign: "right",
    color: "#003049",
  },
  signupButton: {
    mt: 1,
    mb: 2,
    width: "10rem",
    display: "flex",
    justifyContent: "center",
  },
};

export default RegisterForm;
