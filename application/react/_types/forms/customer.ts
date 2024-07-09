import { MongooseId } from "../typeAliases"
import { AddressForm } from "./address"
import { ContactForm } from "./contact"
import { ShippingLocationForm } from "./shippingLocation"

export type CustomerForm = {
  customerId: string,
  name: string,
  businessLocations: AddressForm[],
  shippingLocations: ShippingLocationForm[],
  contacts: ContactForm[],
  overun: string,
  notes?: string,
  creditTerms?: MongooseId[]
}