import axios, { AxiosResponse } from 'axios';
import { IMaterialLengthAdjustment } from '../../api/models/materialLengthAdjustment';
import { SearchResult } from '@shared/http';

export const getMaterialLengthAdjustments = async ({ query, pagination, sorting }: { query?: string, pagination: { pageIndex: number, pageSize: number }, sorting: {id: string, desc: any}[]}): Promise<any> => {
  const { pageIndex, pageSize } = pagination;
  const sortField = sorting.length ? sorting[0]?.id : undefined; // Column ID to sort by
  const sortDirection = sorting.length ? (sorting[0]?.desc ? 'desc' : 'asc') : undefined; // ASC/DESC

  const response : AxiosResponse<SearchResult<IMaterialLengthAdjustment>> = await axios.get(`/material-length-adjustments/search?query=${query || ''}&page=${pageIndex + 1}&limit=${pageSize}&sortField=${sortField}&sortDirection=${sortDirection}`);
  return response.data;
}