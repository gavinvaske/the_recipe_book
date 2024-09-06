import axios, { AxiosResponse } from 'axios';

export const getDies = async (): Promise<any[]> => {
  const response : AxiosResponse = await axios.get(`/dies`);
  const dies: any[] = response.data;

  return dies;
}