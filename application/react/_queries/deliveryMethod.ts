import axios, { AxiosResponse } from 'axios';
import { DeliveryMethod } from '../_types/databaseModels/deliveryMethod';

export const getDeliveryMethods = async (): Promise<DeliveryMethod[]> => {
  const response : AxiosResponse = await axios.get('/delivery-methods');
  const deliveryMethods: DeliveryMethod[] = response.data;

  return deliveryMethods
}