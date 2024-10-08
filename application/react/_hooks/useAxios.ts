import { useEffect } from 'react';
import axios from 'axios';
import { setBearerTokenToAxiosRequestsUsingInterceptors as setBearerTokenOnAxiosRequests } from '../axiosHelpers';
import { useAuth } from './useAuth';
import { useRefreshToken } from './useRefreshToken';
import { AxiosInstance } from 'axios';
import { UserAuth } from '../_context/authProvider';

export const useAxios = (): AxiosInstance => {
  const refreshAccessToken = useRefreshToken();
  const { auth }: { auth: UserAuth} = useAuth();

  useEffect(() => {
    setBearerTokenOnAxiosRequests(axios, auth, refreshAccessToken);
  }, [auth, refreshAccessToken])


  return axios; /* Return axios with Authorization header now set */
}