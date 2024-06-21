import { Address } from "../databaseSchemas/Address";
import { MongooseAttributes } from "./_sharedMongooseAttributes";

export type Vendor = MongooseAttributes & {
  name: string;
  phoneNumber?: string;
  email?: string;
  notes?: string;
  website?: string;
  address: Address;
  primaryContactName: string;
  primaryContactPhoneNumber: string;
  primaryContactEmail: string;
  mfgSpecNumber?: string;
}