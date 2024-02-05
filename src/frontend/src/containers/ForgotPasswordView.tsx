import { Box, Typography } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect } from "react";
import FormInput from "../components/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";
import { ForgotPasswordBody } from "../types/api/accounts";
import { useForgotPasswordMutation } from "../app/api/api";
import { LoadingButton } from "../components/LoadingButtonForm";
import { LinkItem } from "../components/LinkItemForm";
import { matchaColors } from "../styles/colors";

const forgotPasswordSchema = object({
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
});

function ForgotPasswordView() {
  const methods = useForm<ForgotPasswordBody>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [forgotPasswordUser, { isLoading, isSuccess, data }] =
    useForgotPasswordMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message);
    }
  }, [isLoading]);

  const onSubmitForm: SubmitHandler<ForgotPasswordBody> = (values) => {
    forgotPasswordUser(values);
  };

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
        Please enter your Email
      </Typography>
      <FormProvider {...methods}>
        <Box sx={styles.boxForm} component="form" onSubmit={handleSubmit(onSubmitForm)} noValidate>
          <FormInput name="email" label="Email" type="email" />

          <LoadingButton
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            fullWidth
            disableElevation
            type="submit"
            loading={isLoading}
          >
            Retreive Password
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

const styles = {
  boxForm: {
    borderRadius: '10px', 
    backgroundColor: matchaColors.darkBox, 
    padding: '20px', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
  },
}

export default ForgotPasswordView;
