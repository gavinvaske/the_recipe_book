import { MongooseId } from '../typeAliases'
import { MongooseAttributes } from './_sharedMongooseAttributes'

export type MaterialOrder = MongooseAttributes & {
  author: MongooseId,
  material: MongooseId,
  purchaseOrderNumber: string,
  orderDate: Date,
  feetPerRoll: number,
  totalRolls: number,
  totalCost: number,
  vendor: MongooseId,
  hasArrived?: boolean,
  notes?: string,
  arrivalDate: Date
}