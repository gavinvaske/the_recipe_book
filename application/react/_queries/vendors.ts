import axios, { AxiosResponse } from 'axios';
import { Vendor } from '../_types/databasemodels/vendor.ts';

export const getOneVendor = async (mongooseId: string): Promise<Vendor> => {
  const response : AxiosResponse = await axios.get(`/vendors/${mongooseId}`);
  const vendor: Vendor = response.data;

  return vendor;
}