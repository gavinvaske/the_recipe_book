import { useEffect } from 'react';
import axios from '../axios';
import { useAuth } from './useAuth';
import { useRefreshToken } from './useRefreshToken';
import { AxiosInstance } from 'axios';
import { UserAuth } from '../_context/authProvider';

export const useAxios = (): AxiosInstance => {
  const refreshAccessToken = useRefreshToken();
  const { auth }: { auth: UserAuth} = useAuth();

  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      }, (error) => Promise.reject(error)
    );

    const responseIntercept = axios.interceptors.response.use(
      response => response,
      async (error) => {
        const prevRequest = error?.config;

        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refreshAccessToken();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    }
  }, [auth, refreshAccessToken])


  return axios; /* Return axios with Authorization header now set */
}