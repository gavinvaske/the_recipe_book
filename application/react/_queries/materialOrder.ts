import axios, { AxiosResponse } from "axios";
import { MongooseId } from "../_types/typeAliases";
import { IMaterialOrder } from "../../api/models/materialOrder";

export const getOneMaterialOrder = async (mongooseId: MongooseId): Promise<IMaterialOrder> => {
  const response : AxiosResponse = await axios.get(`/material-orders/${mongooseId}`);
  const materialOrder: IMaterialOrder = response.data;

  return materialOrder
}

export const getMaterialOrders = async (): Promise<IMaterialOrder[]> => {
  const response : AxiosResponse = await axios.get(`/material-orders`);
  const materialOrders: IMaterialOrder[] = response.data;

  return materialOrders
}