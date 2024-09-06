import axios, { AxiosResponse } from "axios";
import { MongooseId } from "../_types/typeAliases";

export const getOneProduct = async (mongooseId: MongooseId): Promise<Record<any, any>> => {
  const response : AxiosResponse = await axios.get(`/products/${mongooseId}`);
  const product = response.data;

  return product
}