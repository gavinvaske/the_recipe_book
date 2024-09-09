import axios, { AxiosResponse } from 'axios';
import { IDie } from '../../api/models/die';

export const getDies = async (): Promise<IDie[]> => {
  const response : AxiosResponse = await axios.get(`/dies`);
  const dies: IDie[] = response.data;

  return dies;
}