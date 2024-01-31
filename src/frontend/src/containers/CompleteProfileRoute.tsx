import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks/hooks";

function CompleteProfileRoute() {
  const { user } = useAppSelector((root) => root.user);

  return !user ? (
    <Navigate to={"/"} />
  ) : !user.isProfileCompleted ? (
    <Navigate to={"/complete-profile"} />
  ) : (
    <Outlet />
  );
}

export default CompleteProfileRoute;
