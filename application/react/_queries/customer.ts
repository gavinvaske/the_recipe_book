import axios, { AxiosResponse } from "axios";
import { Customer } from '../_types/databaseModels/customer';
import { MongooseId } from "../_types/typeAliases";

export const getCustomers = async (): Promise<Customer[]> => {
  const response : AxiosResponse = await axios.get(`/customers`);
  const customers: Customer[] = response.data;

  return customers;
}

export const getOneCustomer = async (mongooseId: MongooseId): Promise<Customer> => {
  const response : AxiosResponse = await axios.get(`/customers/${mongooseId}`);
  const customer: Customer = response.data;

  return customer;
}