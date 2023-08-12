import mongoose from 'mongoose';
import { Models } from '../../common/constant';
const Types = mongoose.Schema.Types;

export const SessionSchema = new mongoose.Schema(
  {
    userId: { type: Types.ObjectId, required: true, ref: Models.USER },
    ipAdd: { type: Types.String, required: true, default: '' },
    isActive: { type: Types.Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: true } },
);

SessionSchema.virtual('user', {
  ref: Models.USER,
  foreignField: '_id',
  localField: 'userId',
  justOne: true,
});

SessionSchema.set('toJSON', { virtuals: true });
SessionSchema.set('toObject', { virtuals: true });

SessionSchema.index({ userId: 1, ipAdd: 1 }, { unique: true });

export const SessionModel = mongoose.model(Models.SESSION, SessionSchema);
