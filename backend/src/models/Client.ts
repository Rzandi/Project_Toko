import mongoose, { Document, Schema } from "mongoose";

export interface IClient extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  avatarColor?: string;
  meta?: {
    lastInvoiceAt?: Date;
    totalBilled?: number;
  };
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String },
    address: { type: String },
    notes: { type: String },
    avatarColor: { type: String },
    meta: {
      lastInvoiceAt: Date,
      totalBilled: { type: Number, default: 0 },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// text index for quick search
ClientSchema.index({ user: 1, name: "text", email: "text" });

export default mongoose.models.Client ||
  mongoose.model<IClient>("Client", ClientSchema);
