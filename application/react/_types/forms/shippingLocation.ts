import { MongooseId } from "../typeAliases";
import { AddressFormAttributes } from "./address";

export type ShippingLocationFormAttributes = AddressFormAttributes & {
  freightAccountNumber?: string,
  deliveryMethod?: MongooseId,
}