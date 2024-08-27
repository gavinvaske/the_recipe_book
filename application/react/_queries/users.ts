import axios, { AxiosResponse } from 'axios';
import { User } from '../_types/databasemodels/user.ts';

export const getUsers = async (): Promise<User[]> => {
  const response : AxiosResponse = await axios.get('/users');
  const users: User[] = response.data;

  return users
}

export const getLoggedInUserProfilePictureUrl = async (): Promise<any> => {
  const response : AxiosResponse = await axios.get('/users/me/profile-picture');
  const profilePictureUrl: any = response.data;

  return profilePictureUrl;
}