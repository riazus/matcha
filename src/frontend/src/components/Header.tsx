import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
  useGetNotificationsCountQuery,
  useLogoutMutation,
} from "../app/api/api";
import { useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query";

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

  useEffect(() => {
    if (isLogoutSuccess) {
      navigate("/");
    }
  }, [isLogoutLoading]);

  const onLogoutHandler = async () => {
    logoutUser();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#17553d" }}>
      <Container>
        <Toolbar>
          <Typography
            variant="h5"
            onClick={() => navigate(user?.id ? "/" : "/login")}
            sx={{ cursor: "pointer", color: "#222", fontWeight: 700 }}
          >
            Matcha
          </Typography>
          {user?.id && user?.isProfileCompleted && (
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
                <Box>{notificationCount}</Box>
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

export default Header;
