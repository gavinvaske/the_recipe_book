import { MongooseId } from "../typeAliases"
import { AddressFormAttributes } from "./address"
import { ContactFormAttributes } from "./contact"
import { ShippingLocationFormAttributes } from "./shippingLocation"

export type CustomerFormAttributes = {
  customerId: string,
  name: string,
  businessLocations?: AddressFormAttributes[],
  shippingLocations?: ShippingLocationFormAttributes[],
  billingLocations?: AddressFormAttributes[],
  contacts?: ContactFormAttributes[],
  overun: string,
  notes?: string,
  creditTerms?: MongooseId[]
}