import { DeliveryMethod } from "../databaseModels/deliveryMethod";
import { MongooseId } from "@ui/types/typeAliases";
import { Address } from "./address";

export type ShippingLocation = Address & {
  freightAccountNumber?: string,
  deliveryMethod?: MongooseId | DeliveryMethod
}