import { MongooseId } from "../typeAliases";
import { AddressForm } from "./address";

export type ShippingLocationForm = AddressForm & {
  freightAccountNumber: string,
  deliveryMethod: MongooseId,
}