import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

function CompleteProfileRoute() {
  const { user } = useAppSelector((root) => root.user);

  if (user?.isProfileCompleted === false) {
    return <Navigate to={"/complete-profile"} />;
  } else {
    return <Outlet />;
  }
}

export default CompleteProfileRoute;
