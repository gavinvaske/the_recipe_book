import { AddressForm } from "./address.tsx"
import { ShippingLocationForm } from "./shippingLocation.tsx"

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