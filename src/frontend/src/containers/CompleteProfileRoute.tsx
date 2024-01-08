import { Navigate, Outlet, useLocation } from "react-router-dom";
import { readUser } from "../app/services/localStorageService";

function CompleteProfileRoute() {
  const user = readUser();

  // COMPLETE PROFILE ROUTE !!!
  if (user?.isProfileCompleted === false) {
    return <Navigate to={"/complete-profile"} />;
  } else {
    return <Outlet />;
  }
}

export default CompleteProfileRoute;
