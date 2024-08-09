import axios, { AxiosInstance } from 'axios';
import { UserAuth } from './_context/authProvider';

const instance: AxiosInstance = axios.create({
    baseURL: process.env.BASE_URL as string,
});

export function setBearerTokenToAxiosRequestsUsingInterceptors(axios: AxiosInstance, auth: UserAuth, refreshAccessToken: () => Promise<UserAuth>) {
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
        const { accessToken } = await refreshAccessToken();
        prevRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axios(prevRequest);
      }
      return Promise.reject(error);
    }
  );

  return () => {
    axios.interceptors.request.eject(requestIntercept);
    axios.interceptors.response.eject(responseIntercept);
  }
}

export default instance;