import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Container from "@mui/system/Container";
import Filter from "../components/Filter";

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <Container
        sx={{
          backgroundColor: "#1F3044",
          height: "auto",
        }}
      >
        <Filter />
        <Outlet />
      </Container>
      <Footer />
    </>
  );
};

export { Layout };
