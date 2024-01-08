import { Box, Container, Typography, Link as MuiLink } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import { LoginBody } from "../types/api/accounts";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { LinkItem } from "../components/LinkItemForm";
import { LoadingButton } from "../components/LoadingButtonForm";
import { getGoogleUrl } from "../helpers/getGoogleUrl";
import { ReactComponent as GoogleLogo } from "../assets/google.svg";
import { ReactComponent as GitHubLogo } from "../assets/github.svg";
import { getGitHubUrl } from "../helpers/getGithubUrl";
import { readUser } from "../app/services/localStorageService";
import { useLoginMutation } from "../app/api/api";

const loginSchema = object({
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

//type LoginInput = TypeOf<typeof loginSchema>;

function LoginForm() {
  const methods = useForm<LoginBody>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();

  const [loginUser, { isLoading, isSuccess, error, isError }] =
    useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      const user = readUser();
      if (user?.isProfileCompleted) {
        navigate("/");
      } else {
        navigate("/complete-profile");
      }
      //window.location.href = "/";
    }

    // TODO: Delete this error handler (look rtkQueryErrorMiddleware.tsx)
    if (isError) {
      if ((error as any).error) {
        toast.error((error as any).error);
      } else if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) => toast.error(el.message));
      } else {
        toast.error((error as any).data.message);
      }
    }
  }, [isLoading]);

  const onSubmitForm: SubmitHandler<LoginBody> = (values) => {
    loginUser(values);
  };

  const { handleSubmit } = methods;

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
          <FormInput name="email" label="Email" type="email" />
          <FormInput name="password" label="Password" type="password" />

          <Typography
            sx={{
              fontSize: "0.9rem",
              mb: "1rem",
              textAlign: "right",
              color: "#e5e7eb",
            }}
          >
            <LinkItem to="/forgot-password">Forgot Password?</LinkItem>
          </Typography>

          <LoadingButton
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            fullWidth
            disableElevation
            type="submit"
            loading={isLoading}
          >
            Log In
          </LoadingButton>

          <Typography
            sx={{
              fontSize: "0.9rem",
              mb: "1rem",
              textAlign: "right",
              color: "#e5e7eb",
            }}
          >
            Don't have an account?{" "}
            <LinkItem to="/register">Create New Here</LinkItem>
          </Typography>
        </Box>
      </FormProvider>
      <Typography
        variant="h6"
        component="p"
        sx={{
          my: "1.5rem",
          textAlign: "center",
          color: "white",
        }}
      >
        Log in with another provider:
      </Typography>
      <Box
        maxWidth="27rem"
        width="100%"
        sx={{
          backgroundColor: "#e5e7eb",
          p: { xs: "1rem", sm: "2rem" },
          borderRadius: 2,
        }}
      >
        <MuiLink
          href={getGoogleUrl()}
          sx={{
            backgroundColor: "#f5f6f7",
            borderRadius: 1,
            py: "0.6rem",
            columnGap: "1rem",
            textDecoration: "none",
            color: "#393e45",
            cursor: "pointer",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#fff",
              boxShadow: "0 1px 13px 0 rgb(0 0 0 / 15%)",
            },
          }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <GoogleLogo style={{ height: "2rem" }} />
          Google
        </MuiLink>
        <MuiLink
          href={getGitHubUrl()}
          sx={{
            backgroundColor: "#f5f6f7",
            borderRadius: 1,
            py: "0.6rem",
            mt: "1.5rem",
            columnGap: "1rem",
            textDecoration: "none",
            color: "#393e45",
            cursor: "pointer",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#fff",
              boxShadow: "0 1px 13px 0 rgb(0 0 0 / 15%)",
            },
          }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <GitHubLogo style={{ height: "2rem" }} />
          GitHub
        </MuiLink>
      </Box>
    </Box>
  );
}

export default LoginForm;
