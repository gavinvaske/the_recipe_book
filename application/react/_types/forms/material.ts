import { MongooseId } from "../typeAliases";

export type MaterialFormAttributes = {
  name: string;
  materialId: string;
  vendor: MongooseId;
  materialCategory: MongooseId;
  thickness: number;
  weight: number;
  costPerMsi: number;
  freightCostPerMsi: number;
  width: number;
  faceColor: string;
  adhesive: string;
  adhesiveCategory: MongooseId;
  quotePricePerMsi: number;
  description: string;
  whenToUse: string;
  alternativeStock?: string;
  length: number;
  facesheetWeightPerMsi: number;
  adhesiveWeightPerMsi: number;
  linerWeightPerMsi: number;
  location: string;
  linerType: MongooseId;
  productNumber: string;
  masterRollSize: number;
  image: string;
}