import { MongooseId } from '../typeAliases'
import { MongooseAttributes } from './_sharedMongooseAttributes'
import { AdhesiveCategory } from './adheisiveCategory'
import { MaterialCategory } from './materialCategory'
import { Vendor } from './vendor'

export type Material = MongooseAttributes & {
  name: string,
  materialId: string,
  vendor: MongooseId | Vendor,
  materialCategory: MongooseId | MaterialCategory,
  thickness: number,
  weight: number,
  costPerMsi: number,
  freightCostPerMsi: number,
  width: number,
  faceColor: string,
  adhesive: string,
  adhesiveCategory: MongooseId | AdhesiveCategory,
  quotePricePerMsi: number,
  description: string,
  whenToUse: string,
  alternativeStock?: string,
  length: number,
  facesheetWeightPerMsi: number,
  adhesiveWeightPerMsi: number,
  linerWeightPerMsi: number
}