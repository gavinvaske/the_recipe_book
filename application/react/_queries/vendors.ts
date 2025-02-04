import { IVendor } from '@shared/types/models.ts';
import axios, { AxiosResponse } from 'axios';

export const getOneVendor = async (mongooseId: string): Promise<IVendor> => {
  const response : AxiosResponse = await axios.get(`/vendors/${mongooseId}`);
  const vendor: IVendor = response.data;

  return vendor;
}