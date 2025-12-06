import mongoose, { Document, Schema } from "mongoose";

// Counter collection for atomic invoice sequence per user/series
export interface ICounter extends Document {
  user: mongoose.Types.ObjectId;
  series?: string;
  year?: number;
  month?: number;
  seq: number;
}

const CounterSchema = new Schema<ICounter>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    series: { type: String, default: "default" },
    year: { type: Number },
    month: { type: Number },
    seq: { type: Number, default: 0 },
  },
  { timestamps: true },
);

CounterSchema.index(
  { user: 1, series: 1, year: 1, month: 1 },
  { unique: true },
);

export default mongoose.models.Counter ||
  mongoose.model<ICounter>("Counter", CounterSchema);
