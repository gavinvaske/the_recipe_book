import axios, { AxiosResponse } from 'axios';

export const getCreditTerms = async () => {
  const response : AxiosResponse = await axios.get('/credit-terms');
  const materials = response.data;

  return materials
}