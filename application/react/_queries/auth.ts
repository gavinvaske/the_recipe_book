import axios, { AxiosResponse } from 'axios';

export const getLoggedInUser = async (): Promise<any> => {
  const response : AxiosResponse = await axios.get('/auth/me');
  const loggedInUserDetails: any = response.data;

  return loggedInUserDetails
}