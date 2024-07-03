import { MongooseId } from '../typeAliases'
import { MongooseAttributes } from './_sharedMongooseAttributes'
import { Material } from './material'

export type MaterialInventoryEntry = MongooseAttributes & {
  material: MongooseId | Material,
  length: number,
  notes?: string
}