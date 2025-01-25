import { SearchQuery, SearchResult } from "@shared/types/http";
import axios, { AxiosResponse } from "axios";

export const performTextSearch = async <T>(endpoint: string, searchQuery: SearchQuery): Promise<SearchResult<T>> => {
  const { query, limit: pageSize, pageIndex, sortField, sortDirection } = searchQuery;
  const response : AxiosResponse = await axios.get(`${endpoint}?query=${query || ''}&pageIndex=${pageIndex}&limit=${pageSize}`
    + (sortField ? `&sortField=${sortField}` : '')
    + (sortDirection ? `&sortDirection=${sortDirection}` : '')
  );
  
  return response.data;
}