import { AddressFormAttributes } from "./address.ts"

export type ContactFormAttributes = {
  fullName: string,
  phoneNumber: string,
  phoneExtension: string,
  email: string,
  contactStatus: string,
  notes: string,
  position: string,
  location: AddressFormAttributes
}