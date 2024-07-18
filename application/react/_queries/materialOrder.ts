import axios, { AxiosResponse } from "axios";
import { MongooseId } from "../_types/typeAliases";
import { MaterialOrder } from "../_types/databaseModels/materialOrder";

export const getOneMaterialOrder = async (mongooseId: MongooseId): Promise<MaterialOrder> => {
  const response : AxiosResponse = await axios.get(`/material-orders/${mongooseId}`);
  const materialOrder: MaterialOrder = response.data;

  return materialOrder
}

export const getMaterialOrders = async (): Promise<MaterialOrder[]> => {
  const response : AxiosResponse = await axios.get(`/material-orders`);
  const materialOrders: MaterialOrder[] = response.data;

  return materialOrders
}