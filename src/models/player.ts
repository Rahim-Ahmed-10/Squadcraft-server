import { Schema, model, Document } from "mongoose";

export interface IPlayer extends Document {
  name: string;
  position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
  goals: number;
  rating: number; // 1.0 to 10.0 scale
  imageUrl?: string;
  nationality?: string;
  jerseyNumber?: number;
}

const PlayerSchema = new Schema<IPlayer>(
  {
    name: {
      type: String,
      required: [true, "Player name is required"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      enum: ["Goalkeeper", "Defender", "Midfielder", "Forward"],
    },
    goals: {
      type: Number,
      default: 0,
      min: [0, "Goals cannot be negative"],
    },
    rating: {
      type: Number,
      default: 6.0,
      min: [1, "Rating cannot be less than 1.0"],
      max: [10, "Rating cannot be more than 10.0"],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    nationality: {
      type: String,
      default: null,
    },
    jerseyNumber: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Player = model<IPlayer>("Player", PlayerSchema);
