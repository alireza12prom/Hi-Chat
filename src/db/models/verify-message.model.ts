import mongoose from 'mongoose';
import { Models } from '../../common/constant';
const Types = mongoose.Schema.Types;

export const VerifyMessageSchema = new mongoose.Schema(
  {
    userId: { type: Types.ObjectId, required: true, ref: Models.USER },
    code: { type: Types.Number, required: true },
  },
  { timestamps: { createdAt: true } },
);

VerifyMessageSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: parseInt(process.env.VERIFY_MESSAGE_EXPIRE_SEC) },
);

export const VerifyMessageModel = mongoose.model(
  Models.VERIFY_MESSAGE,
  VerifyMessageSchema,
);
