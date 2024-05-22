import { MongooseId } from '../typeAliases'
import { MongooseAttributes } from './_sharedMongooseAttributes'

export type Material = MongooseAttributes & {
  name: string,
  materialId: string,
  vendor: MongooseId,
  materialCategory: MongooseId,
  thickness: number,
  weight: number,
  costPerMsi: number,
  freightCostPerMsi: number,
  width: number,
  faceColor: string,
  adhesive: string,
  adhesiveCategory: MongooseId,
  quotePricePerMsi: number,
  description: string,
  whenToUse: string,
  alternativeStock?: string,
  length: number,
  facesheetWeightPerMsi: number,
  adhesiveWeightPerMsi: number,
  linerWeightPerMsi: number
}