import { Schema, model, Document } from "mongoose";

export interface INotice extends Document {
  title: string;
  content: string;
  category: "Match" | "Training" | "General";
  createdAt: Date;
}

const NoticeSchema = new Schema<INotice>(
  {
    title: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Notice content is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Match", "Training", "General"],
      default: "General",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Notice = model<INotice>("Notice", NoticeSchema);
