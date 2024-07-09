import { MongooseId } from "../typeAliases"

export type MaterialLengthAdjustmentFormFormAttributes = {
  material: MongooseId,
  length: number,
  notes?: string
}