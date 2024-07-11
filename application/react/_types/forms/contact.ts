import { AddressFormAttributes } from "./address.ts"
import { ShippingLocationFormAttributes } from "./shippingLocation.ts"

export type ContactFormAttributes = {
  fullName: string,
  phoneNumber: string,
  phoneExtension: string,
  email: string,
  contactStatus: string,
  notes: string,
  position: string,
  location: AddressFormAttributes | ShippingLocationFormAttributes 
}