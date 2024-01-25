import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Container from "@mui/system/Container";
import { matchaColors } from "../styles/colors";

interface Styles {
  webContainer: React.CSSProperties;
  layoutContainer: React.CSSProperties;
}

const Layout: React.FC = () => {
  return (
    <div style={styles.webContainer}>
      <Header />
      <Container sx={styles.layoutContainer}>
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};

const styles: Styles = {
  webContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: matchaColors.background,
  },
  layoutContainer: {
    minHeight: "83vh",
    minWidth: "4rem",
    height: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: matchaColors.light,
    borderColor: "black",
    marginTop: "1rem",
    marginBottom: "1rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.7)",
  },
};

export { Layout };
