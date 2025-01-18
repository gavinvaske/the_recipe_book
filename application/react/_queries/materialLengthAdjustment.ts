import axios, { AxiosResponse } from 'axios';
import { IMaterialLengthAdjustment } from '../../api/models/materialLengthAdjustment';

export const getMaterialLengthAdjustments = async ({ query, pageIndex, pageSize, sorting }: { query?: string, pageIndex: number, pageSize: number, sorting: {id: string, desc: any}[]}): Promise<IMaterialLengthAdjustment[]> => {
  const sortField = sorting.length ? sorting[0]?.id : undefined; // Column ID to sort by
  const sortDirection = sorting.length ? (sorting[0]?.desc ? 'desc' : 'asc') : undefined; // ASC/DESC

  const response : AxiosResponse = await axios.get(`/material-length-adjustments/search?query=${query || ''}&page=${pageIndex}&limit=${pageSize}&sortField=${sortField}&sortDirection=${sortDirection}`);
  const materialLengthAdjustments: IMaterialLengthAdjustment[] = response.data.results;

  return materialLengthAdjustments;
}