import axios, { AxiosResponse } from 'axios';
import { Vendor } from '../_types/databaseModels/vendor';

export const getVendors = async (): Promise<Vendor[]> => {
  const response : AxiosResponse = await axios.get('/vendors');
  const vendors: Vendor[] = response.data;

  return vendors
}