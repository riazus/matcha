import { useParams } from "react-router-dom";
import { useVerifyEmailQuery } from "../app/api/api";
import { Typography } from "@mui/material";
import FullScreenLoader from "../components/FullScreenLoader";

function EmailVerificationView() {
  const { token } = useParams();
  const { isSuccess, isLoading } = useVerifyEmailQuery({
    token: token!,
  });

  return isLoading ? (
    <FullScreenLoader />
  ) : (
    <Typography>
      {isSuccess
        ? "Verification successful, you can login"
        : "Verification failed, please try reload the page"}
    </Typography>
  );
}

export default EmailVerificationView;
