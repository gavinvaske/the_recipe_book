import React from 'react';
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import {useRefreshToken} from '../../_hooks/useRefreshToken';
import { useAuth } from '../../_hooks/useAuth';
import { LoadingIndicator } from '../../_global/LoadingIndicator/LoadingIndicator';

export const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refreshAccessToken = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
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

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false;
    }
  }, [])

  return (
    <>
      {
        isLoading
          ? <LoadingIndicator />
          : <Outlet />
      }
    </>
  )
}
