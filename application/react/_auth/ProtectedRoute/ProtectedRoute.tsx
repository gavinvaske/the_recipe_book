import React from 'react';
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../_hooks/useAuth";

type Props = {
  allowedRoles: string[]
}

export const ProtectedRoute = (props: Props) => {
  const { allowedRoles } = props
  const { auth } = useAuth();
  const location = useLocation();

  alert('auth: ' + JSON.stringify(auth))

  return (
    auth?.roles?.find((role) => allowedRoles?.includes(role))
      ? <Outlet />
      : auth?.accessToken //changed from user to accessToken to persist login after refresh
        ? <Navigate to="/unauthorized" state={{ from: location }} replace />
        : <Navigate to="/login" state={{ from: location }} replace />
  );
}