import axios, { AxiosResponse } from 'axios';
import { MongooseId } from '../_types/typeAliases';
import { SearchQuery } from '@shared/types/http';
import { IDie } from '@shared/types/models';

export const getDies = async (searchQuery: SearchQuery): Promise<IDie[]> => {
  const { query, limit: pageSize, pageIndex, sortField, sortDirection } = searchQuery;
  const response : AxiosResponse = await axios.get(`/material-orders/search?query=${query || ''}&pageIndex=${pageIndex}&limit=${pageSize}`
    + (sortField ? `&sortField=${sortField}` : '')
    + (sortDirection ? `&sortDirection=${sortDirection}` : '')
  );
  
  return response.data;
}

export const getOneDie = async (mongooseId: MongooseId): Promise<IDie> => {
  const response : AxiosResponse = await axios.get(`/dies/${mongooseId}`);
  const die: IDie = response.data;
  
  return die;
}