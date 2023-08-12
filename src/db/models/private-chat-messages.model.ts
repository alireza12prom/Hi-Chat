import mongoose from 'mongoose';
import { Models } from '../../common/constant';
const Types = mongoose.Schema.Types;

const PrivateChatMessageSchema = new mongoose.Schema(
  {
    chatId: { type: Types.ObjectId, required: true, ref: Models.PRIVATE_CHAT },
    userId: { type: Types.ObjectId, required: true, ref: Models.USER },
    body: { type: Types.String, required: true },
  },
  { timestamps: { createdAt: true } },
);

// -- virtual fields
PrivateChatMessageSchema.virtual('chat', {
  ref: Models.PRIVATE_CHAT,
  foreignField: '_id',
  localField: 'chatId',
  justOne: true,
});

PrivateChatMessageSchema.virtual('user', {
  ref: Models.USER,
  foreignField: '_id',
  localField: 'userId',
  justOne: true,
});

PrivateChatMessageSchema.set('toJSON', { virtuals: true });
PrivateChatMessageSchema.set('toObject', { virtuals: true });

// --- indexes
PrivateChatMessageSchema.index({ createdAt: -1 });

export const PrivateChatMessageModel = mongoose.model(
  Models.PRIVATE_CHAT_MESSAGE,
  PrivateChatMessageSchema,
);
