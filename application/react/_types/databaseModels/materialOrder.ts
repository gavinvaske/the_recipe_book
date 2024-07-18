import { MongooseId } from '../typeAliases'
import { MongooseAttributes } from './_sharedMongooseAttributes'

export type MaterialOrder = MongooseAttributes & {
  author: MongooseId,
  material: MongooseId,
  purchaseOrderNumber: string,
  orderDate: Date | string,  // TODO (7-17-2024): Is this the approach I want to take?
  feetPerRoll: number,
  totalRolls: number,
  totalCost: number,
  vendor: MongooseId,
  hasArrived?: boolean,
  notes?: string,
  arrivalDate: Date | string  // TODO (7-17-2024): Is this the approach I want to take?
}