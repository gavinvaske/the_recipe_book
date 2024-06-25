import axios, { AxiosResponse } from 'axios';

export const getDeliveryMethods = async () => {
  const response : AxiosResponse = await axios.get('/delivery-methods');
  const materials = response.data;

  return materials
}