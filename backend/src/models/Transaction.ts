import mongoose, { Document, Schema } from "mongoose";

export type TransactionType = "INCOME" | "EXPENSE";

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  type: TransactionType;
  date: Date;
  amount: number; // store in smallest currency unit (e.g., cents)
  currency: string;
  category?: string;
  description?: string;
  paymentMethod?: string;
  notes?: string;
  client?: mongoose.Types.ObjectId;
  invoice?: mongoose.Types.ObjectId;
  attachments?: { url: string; name?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    type: { type: String, enum: ["INCOME", "EXPENSE"], required: true },
    date: { type: Date, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "IDR" },
    category: { type: String },
    description: { type: String },
    paymentMethod: { type: String },
    notes: { type: String },
    client: { type: Schema.Types.ObjectId, ref: "Client" },
    invoice: { type: Schema.Types.ObjectId, ref: "Invoice" },
    attachments: [{ url: String, name: String }],
  },
  { timestamps: true },
);

// indexes for queries
TransactionSchema.index({ user: 1, date: -1 });
TransactionSchema.index({ user: 1, category: 1 });

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
