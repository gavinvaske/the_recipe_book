import { AxiosInstance } from 'axios';
import { UserAuth } from './_context/authProvider';

export function setBearerTokenToAxiosRequestsUsingInterceptors(axios: AxiosInstance, auth: UserAuth, refreshAccessToken: () => Promise<UserAuth>) {
  /* Credit: https://github.com/gitdagray/react_persist_login/blob/8d489823df307bdecdbdc10dcb79d0c748ca1fca/src/hooks/useAxiosPrivate.js#L12 */
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