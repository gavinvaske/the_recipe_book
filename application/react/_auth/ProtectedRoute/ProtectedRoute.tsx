import React, { useEffect, useState } from 'react';
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../_hooks/useAuth";
import { useRefreshToken } from '../../_hooks/useRefreshToken';
import { LoadingIndicator } from '../../_global/LoadingIndicator/LoadingIndicator';

type Props = {
  allowedRoles: string[]
}

export const ProtectedRoute = (props: Props) => {
  const { allowedRoles } = props
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const refreshAccessToken = useRefreshToken();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const getNewAccessToken = async () => {
        try {
          await refreshAccessToken();
        }
        catch (err) {
          console.error(err);
        }
        finally {
          isMounted && setIsLoading(false);
        }
    }

    const doesAccessTokenNeedRefreshed = !auth?.accessToken;

    doesAccessTokenNeedRefreshed ? 
      getNewAccessToken() 
      : setIsLoading(false);

    return () => {
      isMounted = false;
    }
  }, [])

  const allowedRolesUppercased = allowedRoles.map(r => r.toUpperCase())

  return (
    <>
    {
      isLoading ? (<LoadingIndicator />) : (
        auth?.roles?.find((role) => allowedRolesUppercased?.includes(role.toUpperCase()))
          ? <Outlet />
          : auth?.accessToken
            ? <Navigate to="/unauthorized" state={{ from: location }} replace />
            : <Navigate to="/react-ui/login" state={{ from: location }} replace />
      )
    }
    </>
  )
}