import axios, { AxiosResponse } from 'axios';
import { Material } from '../_types/databaseModels/material';

export const getMaterials = async () => {
  const response : AxiosResponse = await axios.get('/materials');
  const materials: Material[] = response.data;

  return materials
}