import { Navigate, Outlet } from "react-router-dom";
import { readUser } from "../app/services/localStorageService";

function CompleteProfileWrapper() {
  if (readUser()?.isProfileCompleted === true) {
    return <Navigate to={"/"} />;
  }

  return <Outlet />;
}

export default CompleteProfileWrapper;
