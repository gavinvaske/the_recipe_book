import axios, { AxiosResponse } from "axios";
import { MongooseId } from "../_types/typeAliases";
import { IMaterialOrder } from "../../api/models/materialOrder";
import { SearchQuery, SearchResult } from "@shared/types/http";

export const getOneMaterialOrder = async (mongooseId: MongooseId): Promise<IMaterialOrder> => {
  const response : AxiosResponse = await axios.get(`/material-orders/${mongooseId}`);
  const materialOrder: IMaterialOrder = response.data;

  return materialOrder
}

// export const getMaterialOrders = async (searchQuery: SearchQuery): Promise<SearchResult<any>> => {
//   const { query, limit: pageSize, pageIndex, sortField, sortDirection } = searchQuery;
//   const response : AxiosResponse = await axios.get(`/material-orders/search?query=${query || ''}&pageIndex=${pageIndex}&limit=${pageSize}`
//     + (sortField ? `&sortField=${sortField}` : '')
//     + (sortDirection ? `&sortDirection=${sortDirection}` : '')
//   );
  
//   return response.data;
// }