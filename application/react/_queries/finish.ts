import axios, { AxiosResponse } from 'axios';

export const getFinishes = async (): Promise<any[]> => {
  const response : AxiosResponse = await axios.get(`/finishes`);
  const finishes: any[] = response.data;

  return finishes;
}