import axios, { AxiosResponse } from 'axios';
import { MongooseId } from '../_types/typeAliases';
import { ILinerType } from '@shared/types/models';

export const getOneLinerType = async (mongooseId: MongooseId) : Promise<ILinerType> => {
  const response : AxiosResponse = await axios.get(`/liner-types/${mongooseId}`);
  const linerType: ILinerType = response.data;

  return linerType;
}