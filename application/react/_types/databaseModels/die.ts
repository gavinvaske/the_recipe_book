import { MongooseAttributes } from './_sharedMongooseAttributes'

export type Die = MongooseAttributes & {
  shape: string
  sizeAcross: number
  sizeAround: number
  dieNumber: string
  numberAcross: number
  numberAround: number
  gear: number
  toolType: string
  notes: string
  cost: number
  vendor: string
  magCylinder: number
  cornerRadius: number
  topAndBottom: number
  leftAndRight: number
  spaceAcross: number
  spaceAround: number
  facestock: string
  liner: string
  specialType?: string
  serialNumber: string
  status: string
  quantity: number
  orderDate?: Date
  arrivalDate?: Date
}