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
  const { isError, isLoading, isSuccess } = useRefreshTokenQuery();
  const { user } = useAppSelector((root) => root.user);

  useEffect(() => {
    if (isSuccess) {
      initializeNotificationConnection(user!.id);
      connectNotificationConnection();
    }
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : isError ? (
        <Navigate to="/login" />
      ) : (
        isSuccess && <Outlet />
      )}
    </>
  );
}

export default ProtectedRoute;
