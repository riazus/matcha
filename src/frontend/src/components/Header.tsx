import {
  ListItemText,
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItem,
} from "@mui/material";
import { useAppSelector } from "../app/hooks/hooks";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
  useGetNotificationsCountQuery,
  useLogoutMutation,
} from "../app/api/api";
import { matchaColors } from "../styles/colors";
import { useEffect, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import { Link } from "react-router-dom";

function Header() {
  const { user } = useAppSelector((root) => root.user);
  const navigate = useNavigate();
  const [
    logoutUser,
    { isLoading: isLogoutLoading, isSuccess: isLogoutSuccess },
  ] = useLogoutMutation();

  const { data: notificationCount } = useGetNotificationsCountQuery(
    user?.id ? undefined : skipToken
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [windowSize, _] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const isMobile = windowSize.width <= 425;

  useEffect(() => {
    if (isLogoutSuccess) {
      navigate("/");
    }
  }, [isLogoutLoading]);

  const onLogoutHandler = async () => {
    logoutUser();
  };

  const list = () => (
    <Box
      role="presentation"
      onClick={() => setDrawerOpen(false)}
      onKeyDown={() => setDrawerOpen(false)}
    >
      <List>
        {[
          "Home",
          "Users",
          "Notifications",
          "Favorites",
          "History",
          "Settings",
        ].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={Link} to={`/${text.toLowerCase()}`}>
              {/* <ListItemIcon></ListItemIcon> */}
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" style={styles.appBar}>
      <Container style={styles.container}>
        <Toolbar>
          {user?.id && user?.isProfileCompleted && isMobile && (
            <>
              <Button onClick={() => setDrawerOpen(true)}>
                <VerticalSplitIcon />
              </Button>
              <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                {list()}
              </Drawer>
            </>
          )}
          <Typography
            variant="h5"
            onClick={() => navigate(user ? "/home" : "/")}
            sx={styles.matchaText}
          >
            Matcha
          </Typography>
          {user?.id && user?.isProfileCompleted && !isMobile && (
            <>
              <Box display="flex" sx={{ ml: "auto" }}>
                <LoadingButton onClick={() => navigate("/users")}>
                  Users
                </LoadingButton>
                <LoadingButton
                  sx={{ padding: 0 }}
                  onClick={() => navigate("/notifications")}
                >
                  Notifications
                </LoadingButton>
                <Box sx={{ color: matchaColors.yellow }}>
                  {notificationCount}
                </Box>
                <LoadingButton onClick={() => navigate("/favorites")}>
                  Favorites
                </LoadingButton>
                <LoadingButton onClick={() => navigate("/history")}>
                  History
                </LoadingButton>
                <LoadingButton onClick={() => navigate("/settings")}>
                  Settings
                </LoadingButton>
              </Box>
            </>
          )}
          <Box display="flex" sx={{ ml: "auto" }}>
            {!user?.id ? (
              <>
                <LoadingButton
                  sx={{ mr: 2 }}
                  onClick={() => navigate("/register")}
                >
                  SignUp
                </LoadingButton>
                <LoadingButton onClick={() => navigate("/login")}>
                  Login
                </LoadingButton>
              </>
            ) : (
              <LoadingButton
                onClick={onLogoutHandler}
                loading={isLogoutLoading}
              >
                Logout
              </LoadingButton>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const styles = {
  appBar: {
    backgroundColor: matchaColors.background,
    height: "8vh",
    color: matchaColors.text,
    display: "flex",
    justifyContent: "space-between",
  },
  matchaText: {
    cursor: "pointer",
    color: matchaColors.yellow,
    fontWeight: 700,
  },
  container: {},
};

export default Header;
