import { DeliveryMethod } from "../databaseModels/deliveryMethod";
import { MongooseId } from "../typeAliases";
import { Address } from "./address";

export type ShippingLocation = Address & {
  freightAccountNumber?: string,
  deliveryMethod?: MongooseId | DeliveryMethod
}