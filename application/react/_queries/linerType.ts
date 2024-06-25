import axios, { AxiosResponse } from 'axios';

export const getLinerTypes = async () => {
  const response : AxiosResponse = await axios.get('/liner-types');
  const materials = response.data;

  return materials
}