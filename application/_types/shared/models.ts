import { Document, Types } from "mongoose";
import { SchemaTimestampsConfig } from "mongoose";
import { IAddress, IContact, IShippingLocation } from "./schemas.ts";

export interface IMaterialCategory extends SchemaTimestampsConfig, Document {
  name: string;
}

export interface IAdhesiveCategory extends SchemaTimestampsConfig, Document {
  name: string;
}

export interface ILinerType extends SchemaTimestampsConfig, Document {
  name: string;
}

export interface ICreditTerm extends SchemaTimestampsConfig, Document {
  description: string;
}

export interface ICustomer extends SchemaTimestampsConfig, Document {
  customerId: string;
  name: string;
  notes?: string;
  businessLocations?: IAddress[];
  shippingLocations?: IShippingLocation[];
  billingLocations?: IAddress[];
  contacts?: IContact[];
  creditTerms?: Types.ObjectId[] | ICreditTerm[];
  overun: number;
}

export interface IVendor extends SchemaTimestampsConfig, Document  {
  name: string;
  phoneNumber?: string;
  email?: string;
  notes?: string;
  website?: string;
  address: IAddress;
  primaryContactName: string;
  primaryContactPhoneNumber: string;
  primaryContactEmail: string;
  mfgSpecNumber?: string;
}

export interface IMaterialLengthAdjustment extends SchemaTimestampsConfig, Document  {
  material: Types.ObjectId | IMaterial;
  length: number;
  notes?: string;
}

export interface IMaterial extends SchemaTimestampsConfig, Document {
  name: string;
  materialId: string;
  vendor: Types.ObjectId | IVendor;
  materialCategory: Types.ObjectId;
  weight: number;
  costPerMsi: number;
  freightCostPerMsi: number;
  width: number;
  faceColor: string;
  adhesive: string;
  thickness: number;
  adhesiveCategory: Types.ObjectId;
  quotePricePerMsi: number;
  description: string;
  whenToUse: string;
  alternativeStock?: string;
  length: number;
  facesheetWeightPerMsi: number;
  adhesiveWeightPerMsi: number;
  linerWeightPerMsi: number;
  locations: string[];
  linerType: Types.ObjectId;
  productNumber: string;
  masterRollSize: number;
  image: string;
  minFootageAlertThreshold: number;
}

export interface IDie extends SchemaTimestampsConfig, Document {
  dieNumber: string,
  shape: string,
  sizeAcross: number,
  sizeAround: number,
  numberAcross: number,
  numberAround: number,
  gear: number,
  toolType: string,
  notes: string,
  cost: number,
  vendor: string,
  magCylinder: number,
  cornerRadius: number,
  topAndBottom: number,
  leftAndRight: number,
  spaceAcross: number,
  spaceAround: number,
  facestock: string,
  liner: string,
  specialType?: string,
  serialNumber: string,
  status: string,
  quantity: number,
  orderDate?: Date,
  arrivalDate?: Date
}