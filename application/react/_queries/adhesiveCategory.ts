import axios, { AxiosResponse } from "axios";
import { AdhesiveCategory } from "../_types/databaseModels/adhesiveCategory";
import { MongooseId } from "../_types/typeAliases";

export const getOneAdhesiveCategory = async (mongooseId: MongooseId): Promise<AdhesiveCategory> => {
  const response : AxiosResponse = await axios.get(`/adhesive-categories/${mongooseId}`);
  const adhesiveCategory: AdhesiveCategory = response.data;

  return adhesiveCategory;
}