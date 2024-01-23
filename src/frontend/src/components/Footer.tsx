import { Box, Typography } from "@mui/material";
import { setColors } from "../styles/colors";

const Footer = () => {
  return (
    <Box sx={styles.box}>
      <Typography>@matcha 2024 abarot & riazus</Typography>
    </Box>
  );
};

const styles = {
  box: {
    backgroundColor: setColors("lightGray"),
    height: "4rem",
    boxShadow: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default Footer;
