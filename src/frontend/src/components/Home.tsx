import { useAppSelector } from "../app/hooks";
import { Container } from "@mui/system";
import { Typography } from "@mui/material";
import { useRefreshTokenQuery } from "../app/api/api";
import FullScreenLoader from "./FullScreenLoader";
import { skipToken } from "@reduxjs/toolkit/query";
import { readUser } from "../app/services/localStorageService";

function Home() {
  const { user } = useAppSelector((root) => root.user);
  const localUser = readUser();
  const { isLoading } = useRefreshTokenQuery(localUser ? undefined : skipToken);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Container
      sx={{
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 600,
          fontSize: { xs: "2rem", md: "3rem" },
          color: "#f9d13e",
        }}
      >
        {user?.id
          ? "User authenticated and profile completed"
          : "User NOT authenticated"}
      </Typography>
      {user?.id && (
        <Typography variant="h3" sx={{ color: "#f9d13e" }}>
          User: {user?.firstName} {user?.lastName}
        </Typography>
      )}
    </Container>
  );
}

export default Home;
