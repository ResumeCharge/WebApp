import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { store } from "../../store/store";

const GuardedRoute = () => {
  const isSignedIn = store.getState().UserReducer.isSignedIn;
  try {
    if (isSignedIn) {
      return <Outlet />;
    } else {
      return <Navigate to="/" />;
    }
  } catch (error) {
    return <Navigate to="/" />;
  }
};

export default GuardedRoute;
