import { DeliveryMethod } from 'aws-sdk/clients/amplifybackend';
import axios, { AxiosResponse } from 'axios';

export const getDeliveryMethods = async () => {
  const response : AxiosResponse = await axios.get('/delivery-methods');
  const deliveryMethods: DeliveryMethod[] = response.data;

  return deliveryMethods
}