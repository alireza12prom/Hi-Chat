import { Types } from 'mongoose';

export function toObjectId(userId: string) {
  return new Types.ObjectId(userId);
}
