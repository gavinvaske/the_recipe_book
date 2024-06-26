import axios, { AxiosResponse } from 'axios';
import { LinerType } from '../_types/databaseModels/linerType';

export const getLinerTypes = async (): Promise<LinerType[]> => {
  const response : AxiosResponse = await axios.get('/liner-types');
  const linerTypes: LinerType[] = response.data;

  return linerTypes
}