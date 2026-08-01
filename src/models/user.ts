import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  password?: string; // Hashed password
  role: "Admin" | "Player";
  playerId?: Types.ObjectId | null; // Null for admin, linked player profile for Player
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Player"],
      default: "Player",
    },
    playerId: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", UserSchema);
