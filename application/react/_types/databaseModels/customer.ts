import { Address } from "../databaseSchemas/address";
import { Contact } from "../databaseSchemas/contact";
import { ShippingLocation } from "../databaseSchemas/ShippingLocation";
import { MongooseId } from "../typeAliases";
import { MongooseAttributes } from "./_sharedMongooseAttributes";
import { CreditTerm } from "./creditTerm";

export type Customer = MongooseAttributes & {
  customerId: string,
  name: string,
  notes?: string,
  businessLocations?: Address[],
  shippingLocations?: ShippingLocation[],
  billingLocations?: Address[],
  contacts: Contact[],
  creditTerms?: MongooseId[] | CreditTerm[],
  overun: number,  
}