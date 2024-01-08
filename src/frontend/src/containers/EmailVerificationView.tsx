import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useVerifyEmailQuery } from "../app/api/api";
import { Box, Container } from "@mui/system";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";

function EmailVerificationView() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { data, isSuccess, isError, error, isLoading } = useVerifyEmailQuery({
    token: token!,
  });

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate("/login");
      }, 5000);
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

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2363eb",
        height: "95vh",
      }}
    >
      <Box justifyContent={"center"}>
        <Typography
          textAlign="center"
          component="h1"
          sx={{ fontWeight: 600, fontSize: { xs: "2rem", md: "3rem" } }}
        >
          {isLoading ? "Verification in progress..." : data?.message}
        </Typography>
      </Box>
    </Container>
  );
}

export default EmailVerificationView;
