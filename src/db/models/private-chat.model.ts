import mongoose, { Model } from 'mongoose';
import { Models } from '../../common/constant';
const Types = mongoose.Schema.Types;

export interface IChatModel {
  members: string[];
}

const PrivateChatSchema = new mongoose.Schema<IChatModel>(
  {
    members: [{ type: Types.ObjectId, required: true, ref: Models.USER }],
  },
  { timestamps: { createdAt: true } },
);

export const PrivateChatModel = mongoose.model(
  Models.PRIVATE_CHAT,
  PrivateChatSchema,
);
