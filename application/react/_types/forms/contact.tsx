import { AddressForm } from "./address"
import { ShippingLocationForm } from "./shippingLocation"

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