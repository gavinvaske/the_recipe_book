import axios, { AxiosResponse } from 'axios';
import { IMaterialLengthAdjustment } from '../../api/models/materialLengthAdjustment';
import { SearchResult } from '@shared/http';

export const getMaterialLengthAdjustments = async ({ query, pagination, sorting }: { query?: string, pagination: { pageIndex: number, pageSize: number }, sorting: {id: string, desc: any}[]}): Promise<any> => {
  const { pageIndex, pageSize } = pagination;
  const sortField = sorting.length ? sorting[0]?.id : undefined;
  const sortDirection = sorting.length ? (sorting[0]?.desc ? 'desc' : 'asc') : undefined;

  const response : AxiosResponse<SearchResult<IMaterialLengthAdjustment>> = await axios.get(`/material-length-adjustments/search?query=${query || ''}&pageIndex=${pageIndex}&limit=${pageSize}&sortField=${sortField}&sortDirection=${sortDirection}`);
  return response.data;
}