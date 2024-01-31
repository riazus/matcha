import { Typography } from "@mui/material";

function NotFound() {
  return (
    <Typography
      textAlign="center"
      component="h1"
      sx={{
        fontWeight: 600,
        fontSize: { xs: "2rem", md: "3rem" },
        color: "#f9d13e",
      }}
    >
      404: NOT FOUND
    </Typography>
  );
}

export default NotFound;
