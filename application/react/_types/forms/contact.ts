import { AddressForm } from "./address.ts"
import { ShippingLocationForm } from "./shippingLocation.ts"

export type ContactForm = {
  fullName: string,
  phoneNumber: string,
  phoneExtension: string,
  email: string,
  contactStatus: string,
  notes: string,
  position: string,
  location: AddressForm | ShippingLocationForm 
}