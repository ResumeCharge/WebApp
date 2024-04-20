import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "firebase/auth";

const RedirectToAccountForLoggedInUsersRoute = () => {
  try {
    const auth = getAuth();
    if (auth.currentUser) {
      return <Navigate to="/account" />;
    } else {
      return <Outlet />;
    }
  } catch (error) {
    return <Navigate to="/" />;
  }
};

export default RedirectToAccountForLoggedInUsersRoute;
