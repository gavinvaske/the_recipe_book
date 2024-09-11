import axios, { AxiosResponse } from 'axios';
import { IDie } from '../../api/models/die2';
import { MongooseId } from '../_types/typeAliases';

export const getDies = async (): Promise<IDie[]> => {
  const response : AxiosResponse = await axios.get(`/dies`);
  const dies: IDie[] = response.data;

  return dies;
}

export const getOneDie = async (mongooseId: MongooseId): Promise<IDie> => {
  const response : AxiosResponse = await axios.get(`/dies/${mongooseId}`);
  const die: IDie = response.data;
  
  return die;
}