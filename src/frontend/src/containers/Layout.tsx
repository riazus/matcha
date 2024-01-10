import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Container from "@mui/system/Container";
import { borderColor } from "@mui/system";

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <Container
        sx={styles.layoutContainer}
        >
        <Outlet />
      </Container>
      <Footer />
    </>
  );
};

const styles = {
  layoutContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffffc",
    height: "auto",
    borderColor: "black",
    marginTop: "10px",
    marginBottom: "10px",
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.7)'
  }
}

export { Layout };
