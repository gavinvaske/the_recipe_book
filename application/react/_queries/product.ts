import axios, { AxiosResponse } from "axios";
import { MongooseId } from "../_types/typeAliases";
import { IBaseProduct } from "../../api/models/baseProduct.ts";

export const getOneProduct = async (mongooseId: MongooseId): Promise<IBaseProduct> => {
  const response : AxiosResponse = await axios.get(`/products/${mongooseId}`);
  const product = response.data;

  return product
}

export const getProducts = async (): Promise<IBaseProduct[]> => {
  const response : AxiosResponse = await axios.get(`/products`);
  const products: IBaseProduct[] = response.data;
  
  return products;
}