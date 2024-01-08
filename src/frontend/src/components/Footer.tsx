import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: "#17553d", height: "4rem", boxShadow: 15 }}
    >
      <Typography>Copyright @2022</Typography>
    </Box>
  );
};

export default Footer;
