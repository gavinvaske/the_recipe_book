import axios, { AxiosResponse } from 'axios';

export const getMaterials = async () => {
  const response : AxiosResponse = await axios.get('/materials');
  const materials = response.data;

  return materials
}