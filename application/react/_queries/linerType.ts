import axios, { AxiosResponse } from 'axios';
import { LinerType } from '../_types/databaseModels/linerType';
import { MongooseId } from '../_types/typeAliases';

export const getLinerTypes = async (): Promise<LinerType[]> => {
  const response : AxiosResponse = await axios.get('/liner-types');
  const linerTypes: LinerType[] = response.data;

  return linerTypes
}

export const getOneLinerType = async (mongooseId: MongooseId) : Promise<LinerType> => {
  const response : AxiosResponse = await axios.get(`/liner-types/${mongooseId}`);
  const linerType: LinerType = response.data;

  return linerType;
}