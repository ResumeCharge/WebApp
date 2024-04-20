import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { store } from "../../store/store";

export default function UserAlreadySignedInGuard() {
  const isSignedIn = store.getState().UserReducer.isSignedIn;
  try {
    if (isSignedIn) {
      return <Navigate to="/" />;
    } else {
      return <Outlet />;
    }
  } catch (error) {
    return <Navigate to="/" />;
  }
}
