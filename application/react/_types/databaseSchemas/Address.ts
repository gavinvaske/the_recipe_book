import { MongooseAttributes } from "../databaseModels/_sharedMongooseAttributes";

export type Address = MongooseAttributes & {
  name: string;
  street: string,
  unitOrSuite?: string;
  city: string;
  state: string;
  zipCode: string;
}