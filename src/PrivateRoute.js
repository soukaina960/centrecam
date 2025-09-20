import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Vérifie la présence de l'utilisateur dans le localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
