import axios, { AxiosResponse } from 'axios';
import { IMaterialLengthAdjustment } from '../../api/models/materialLengthAdjustment';
import { SearchResult, SearchQuery } from '@shared/types/http';

export const getMaterialLengthAdjustments = async (searchQuery: SearchQuery): Promise<SearchResult<any>> => {
  const { query, limit: pageSize, pageIndex, sortField, sortDirection } = searchQuery;
  const response : AxiosResponse<SearchResult<IMaterialLengthAdjustment>> = await axios.get(`/material-length-adjustments/search?query=${query || ''}&pageIndex=${pageIndex}&limit=${pageSize}&sortField=${sortField}&sortDirection=${sortDirection}`);
  
  return response.data;
  }