import { Document } from "mongoose";
import { SchemaTimestampsConfig } from "mongoose";

export interface IAddress extends SchemaTimestampsConfig, Document {
  name: string;
  street: string;
  unitOrSuite?: string;
  city: string;
  state: string;
  zipCode: string;
}