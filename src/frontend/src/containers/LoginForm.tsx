import { Box, Typography, Link as MuiLink } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";
import FormInput from "../components/FormInput";
import { LoginBody } from "../types/api/accounts";
import { LinkItem } from "../components/LinkItemForm";
import { LoadingButton } from "../components/LoadingButtonForm";
import { getGoogleUrl } from "../helpers/getGoogleUrl";
import { ReactComponent as GoogleLogo } from "../assets/google.svg";
import { ReactComponent as GitHubLogo } from "../assets/github.svg";
import { getGitHubUrl } from "../helpers/getGithubUrl";
import { useLoginMutation } from "../app/api/api";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { matchaColors } from "../styles/colors";

const loginSchema = object({
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

function LoginForm() {
  const methods = useForm<LoginBody>({
    resolver: zodResolver(loginSchema),
  });
  const [loginUser, { isLoading, isSuccess }] = useLoginMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/home");
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
          letterSpacing: 1,
          mb: "5px",
        }}
      >
        Welcome Back!
      </Typography>
      <Typography
        variant="h6"
        component="h2"
        sx={{ color: matchaColors.yellowlight, mb: 2 }}
      >
        Login to have access
      </Typography>
      <FormProvider {...methods}>
        <Box
          sx={styles.boxForm}
          component="form"
          onSubmit={handleSubmit(onSubmitForm)}
          noValidate
        >
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
              color: "black",
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
          my: "10px",
          textAlign: "center",
          color: matchaColors.yellowlight,
        }}
      >
        Log in with another provider:
      </Typography>
      <Box
        maxWidth="27rem"
        width="100%"
        sx={{
          backgroundColor: matchaColors.darkBox,
          p: { xs: "1rem", sm: "2rem" },
          borderRadius: 2,
          mb: "10px",
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

const styles = {
  boxForm: {
    borderRadius: "10px", 
    backgroundColor: matchaColors.darkBox, 
    padding: "20px",
    paddingBottom: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
  },
};

export default LoginForm;
