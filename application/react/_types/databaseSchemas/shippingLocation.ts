import { Address } from "./address";

export type ShippingLocation = Address & {
  freightAccountNumber?: string,
  deliveryMethod?: string
}