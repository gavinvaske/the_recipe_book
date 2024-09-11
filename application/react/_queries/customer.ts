import axios, { AxiosResponse } from "axios";
// import { Customer } from '../_types/databasemodels/customer.ts';
import { MongooseId } from "../_types/typeAliases";
import { ICustomer } from "../../api/models/customer";

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