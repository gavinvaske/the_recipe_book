import axios, { AxiosResponse } from 'axios';
import { MongooseId } from '../_types/typeAliases';
import { IMaterialCategory } from '@shared/types/models';

export const getOneMaterialCategory = async (mongooseId: MongooseId) : Promise<IMaterialCategory> => {
  const response : AxiosResponse = await axios.get(`/material-categories/${mongooseId}`);
  const materialCategory: IMaterialCategory = response.data;

  return materialCategory;
}