import axios, { AxiosResponse } from "axios";
import { MongooseId } from "../_types/typeAliases";
import { IAdhesiveCategory } from "@shared/types/models";

export const getOneAdhesiveCategory = async (mongooseId: MongooseId): Promise<IAdhesiveCategory> => {
  const response : AxiosResponse = await axios.get(`/adhesive-categories/${mongooseId}`);
  const adhesiveCategory: IAdhesiveCategory = response.data;

  return adhesiveCategory;
}