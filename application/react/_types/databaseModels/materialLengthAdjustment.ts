import { MongooseId } from '../typeAliases'
import { MongooseAttributes } from './_sharedMongooseAttributes'
import { Material } from './material'

export type MaterialLengthAdjustment = MongooseAttributes & {
  material: MongooseId | Material,
  length: number,
  notes?: string
}