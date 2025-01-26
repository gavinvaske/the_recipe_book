import axios, { AxiosResponse } from 'axios';
import { LinerType } from '../_types/databasemodels/linerType.ts';
import { MongooseId } from '../_types/typeAliases';

export const getOneLinerType = async (mongooseId: MongooseId) : Promise<LinerType> => {
  const response : AxiosResponse = await axios.get(`/liner-types/${mongooseId}`);
  const linerType: LinerType = response.data;

  return linerType;
}