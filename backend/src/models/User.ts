import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  role: "owner" | "accountant";
  business: {
    name?: string;
    logoUrl?: string;
    address?: string;
    npwp?: string;
  };
  settings: {
    theme: "light" | "dark" | "system";
    lang: string;
    currency: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema = new Schema(
  {
    name: { type: String },
    logoUrl: { type: String },
    address: { type: String },
    npwp: { type: String },
  },
  { _id: false },
);

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String },
    role: { type: String, enum: ["owner", "accountant"], default: "owner" },
    business: { type: BusinessSchema, default: {} },
    settings: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      lang: { type: String, default: "id" },
      currency: { type: String, default: "IDR" },
    },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
