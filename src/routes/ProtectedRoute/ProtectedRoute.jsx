import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

import ClientLayout from "layouts/ClientLayout/ClientLayout";

export default function ProtectedRoute({ children }) {
  const auth = useSelector((state) => state.auth);

  if (auth.token) {
    return <ClientLayout />;
  } else {
    return <Navigate to="/login" />;
  }
}
