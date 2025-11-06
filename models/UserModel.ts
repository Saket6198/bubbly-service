import mongoose from "mongoose";
import { UserProps } from "../types";

const UserSchema = new mongoose.Schema<UserProps>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
const UserModel = mongoose.model<UserProps>("User", UserSchema);
export default UserModel;
