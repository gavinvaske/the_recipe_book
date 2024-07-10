import axios, { AxiosResponse } from 'axios';
import { DeliveryMethod } from '../_types/databaseModels/deliveryMethod';
import { MongooseId } from '../_types/typeAliases';

export const getDeliveryMethods = async (): Promise<DeliveryMethod[]> => {
  const response : AxiosResponse = await axios.get('/delivery-methods');
  const deliveryMethods: DeliveryMethod[] = response.data;

  return deliveryMethods
}

export const getOneDeliveryMethod = async (mongooseId: MongooseId): Promise<DeliveryMethod> => {
  const response : AxiosResponse = await axios.get(`/delivery-methods/${mongooseId}`);
  const deliveryMethod: DeliveryMethod = response.data;

  return deliveryMethod
}