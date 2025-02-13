import React from 'react';
import { Route, Navigate } from 'react-router-dom';

function PrivateRoute({ element: Element, ...rest }) {
  const token = localStorage.getItem('token'); // Vérifie si le token existe dans localStorage

  return (
    <Route
      {...rest}
      element={token ? <Element /> : <Navigate to="/login" />}
    />
  );
}

export default PrivateRoute;
