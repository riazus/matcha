import { Box, Typography } from "@mui/material";
import { matchaColors } from "../styles/colors";

const Footer = () => {
  return (
    <Box sx={styles.box}>
      <Typography>@matcha 2024 abarot & riazus</Typography>
    </Box>
  );
};

const styles = {
  box: {
    backgroundColor: matchaColors.background,
    color: matchaColors.text,
    height: "6vh",
    boxShadow: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default Footer;
