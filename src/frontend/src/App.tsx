import { CssBaseline } from "@mui/material";
import RegisterForm from "./containers/RegisterForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NotFound from "./components/NotFound";
import { Layout } from "./containers/Layout";
import LoginForm from "./containers/LoginForm";
import Home from "./components/Home";
import EmailVerificationView from "./containers/EmailVerificationView";
import ResetPasswordView from "./containers/ResetPasswordView";
import ForgotPasswordView from "./containers/ForgotPasswordView";
import ProtectedRoute from "./containers/ProtectedRoute";
import CompleteProfileRoute from "./containers/CompleteProfileRoute";
import CompleteProfileWrapper from "./containers/CompleteProfileWrapper";
import CompleteProfile from "./containers/CompleteProfile";
import UserForm from "./containers/UserForm";
import SettingsForm from "./containers/SettingsForm";
import FavoritesList from "./containers/FavoriteProfilesList";
import UsersList from "./containers/UsersList";
import NotificationsList from "./containers/NotificationsList";
import HistoryList from "./containers/HistoryList";
import { disconnectNotificationConnection } from "./sockets/notificationConnection";
import { useEffect } from "react";
import UsersBrowsing from "./containers/UsersBrowsing";


const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        element: <CompleteProfileRoute />, // is profile completed
        children: [
          {
            path: "/register",
            element: <RegisterForm />,
          },
          {
            path: "/login",
            element: <LoginForm />,
          },
          {
            path: "/verify-email/:token",
            element: <EmailVerificationView />,
          },
          {
            path: "/reset-password/:token",
            element: <ResetPasswordView />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPasswordView />,
          },
        ],
      },
      {
        element: <ProtectedRoute />, // is profile authenticated
        children: [
          {
            element: <CompleteProfileWrapper />,
            children: [
              {
                path: "/complete-profile",
                element: <CompleteProfile />,
              },
            ],
          },
          {
            element: <CompleteProfileRoute />, // is profile completed
            children: [
              {
                path: "/",
                element: <UsersBrowsing />,
              },
              {
                path: "/users",
                element: <UsersList />,
              },
              {
                path: "/notifications",
                element: <NotificationsList />,
              },
              {
                path: "/favorites",
                element: <FavoritesList />,
              },
              {
                path: "/history",
                element: <HistoryList />,
              },
              {
                path: "/settings",
                element: <SettingsForm />,
              },
              {
                path: "/users/:id",
                element: <UserForm />,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  useEffect(() => {
    return () => {
      disconnectNotificationConnection();
    };
  }, []);

  return (
    <>
      <CssBaseline />
      <ToastContainer position="bottom-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
