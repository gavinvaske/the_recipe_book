import axios, { AxiosResponse } from "axios";

type TODO = any;

export const getQuotes = async (): Promise<TODO[]> => {
  const response : AxiosResponse = await axios.get(`/quotes`);
  const products: TODO[] = response.data;
  
  return products;
}