import { MongooseAttributes } from "../databaseModels/_sharedMongooseAttributes";
import { Address } from "./address";

export type Contact = MongooseAttributes & {
  fullName: string,
  phoneNumber?: string,
  phoneExtension?: number,
  email?: string,
  contactStatus: string,
  notes?: string,
  position?: string,
  location?: Address
}