import { Types } from 'mongoose';

export function isPopulated<T>(value: Types.ObjectId | T): value is T {
  return typeof value !== 'string' && !(value instanceof Types.ObjectId);
}