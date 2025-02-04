import axios, { AxiosResponse } from "axios";
import { MongooseId } from "@ui/types/typeAliases";
import { ICustomer } from '@shared/types/models.ts';

export const getCustomers = async (): Promise<ICustomer[]> => {
  const response : AxiosResponse = await axios.get(`/customers`);
  const customers: ICustomer[] = response.data;

  return customers;
}

export const getOneCustomer = async (mongooseId: MongooseId): Promise<ICustomer> => {
  const response : AxiosResponse = await axios.get(`/customers/${mongooseId}`);
  const customer: ICustomer = response.data;

  return customer;
}