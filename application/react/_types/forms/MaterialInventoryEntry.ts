import { MongooseId } from "../typeAliases"

export type MaterialInventoryEntryFormAttributes = {
  material: MongooseId,
  length: number,
  notes?: string
}