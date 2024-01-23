import { Navigate, Outlet } from "react-router-dom";
import { useRefreshTokenQuery } from "../app/api/api";
import FullScreenLoader from "../components/FullScreenLoader";
import { useEffect } from "react";
import {
  connectNotificationConnection,
  initializeNotificationConnection,
} from "../sockets/notificationConnection";
import { useAppSelector } from "../app/hooks";

function ProtectedRoute() {
  const { user } = useAppSelector((root) => root.user);
  const { isError, isLoading, isSuccess } = useRefreshTokenQuery();

  useEffect(() => {
    if (isSuccess) {
      if (user) {
        initializeNotificationConnection(user.id);
        connectNotificationConnection();
      }
    }
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : isError ? (
        <Navigate to="/" />
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default ProtectedRoute;
