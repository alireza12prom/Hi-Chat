import mongoose from 'mongoose';
import { Models } from '../../common/constant';
const Types = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema(
  {
    fname: { type: Types.String },
    lname: { type: Types.String },
    email: { type: Types.String, required: true, unique: true },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model(Models.USER, UserSchema);
