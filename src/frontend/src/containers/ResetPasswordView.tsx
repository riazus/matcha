import { Box, Typography } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import FormInput from "../components/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypeOf, object, string } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../app/api/api";
import { LoadingButton } from "../components/LoadingButtonForm";
import { LinkItem } from "../components/LinkItemForm";

const resetPasswordSchema = object({
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  confirmPassword: string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;

function ResetPasswordView() {
  const methods = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const { handleSubmit } = methods;
  const navigate = useNavigate();
  const { token } = useParams();

  const [resetPasswordUser, { isLoading, isSuccess }] =
    useResetPasswordMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  const onSubmitForm: SubmitHandler<ResetPasswordInput> = (values) => {
    resetPasswordUser({
      token: token!,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography
        textAlign="center"
        component="h1"
        sx={{
          color: "#f9d13e",
          fontWeight: 600,
          fontSize: { xs: "2rem", md: "3rem" },
          mb: 2,
          letterSpacing: 1,
        }}
      >
        Welcome Back!
      </Typography>
      <Typography
        variant="body1"
        component="h2"
        sx={{ color: "#e5e7eb", mb: 2 }}
      >
        Login to have access!
      </Typography>
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmitForm)} noValidate>
          <FormInput name="password" label="Password" type="password" />
          <FormInput
            name="confirmPassword"
            label="Confirm Password"
            type="password"
          />

          <LoadingButton
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            fullWidth
            disableElevation
            type="submit"
            loading={isLoading}
          >
            Reset Password
          </LoadingButton>

          <Typography
            sx={{
              fontSize: "0.9rem",
              mb: "1rem",
              textAlign: "right",
              color: "#e5e7eb",
            }}
          >
            <LinkItem to="/login">Back to Login</LinkItem>
          </Typography>
        </Box>
      </FormProvider>
    </Box>
  );
}

export default ResetPasswordView;
