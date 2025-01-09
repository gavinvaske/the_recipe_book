import axios, { AxiosResponse } from 'axios';
import { IMaterialLengthAdjustment } from '../../api/models/materialLengthAdjustment';

export const getMaterialLengthAdjustments = async (): Promise<IMaterialLengthAdjustment[]> => {
  const response : AxiosResponse = await axios.get('/material-length-adjustments');
  const materialLengthAdjustments: IMaterialLengthAdjustment[] = response.data;

  return materialLengthAdjustments
}