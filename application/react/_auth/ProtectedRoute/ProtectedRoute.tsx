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

  const allowedRolesUppercased = allowedRoles.map(r => r.toUpperCase())

  return (
    auth?.roles?.find((role) => allowedRolesUppercased?.includes(role.toUpperCase()))
      ? <Outlet />
      : auth?.accessToken
        ? <Navigate to="/unauthorized" state={{ from: location }} replace />
        : <Navigate to="/react-ui/login" state={{ from: location }} replace />
  );
}