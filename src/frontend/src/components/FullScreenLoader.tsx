import { Box, CircularProgress } from "@mui/material";

const FullScreenLoader = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100%" }}
    >
      <CircularProgress />
    </Box>
  );
};

export default FullScreenLoader;
