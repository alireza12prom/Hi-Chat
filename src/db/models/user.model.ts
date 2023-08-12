import mongoose from 'mongoose';
import { Models } from '../../common/constant';
const Types = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema(
  {
    fname: { type: Types.String, required: true, default: null },
    lname: { type: Types.String, required: true, default: null },
    email: { type: Types.String, required: true, unique: true },
    bio: { type: Types.String, required: true, default: null },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model(Models.USER, UserSchema);
