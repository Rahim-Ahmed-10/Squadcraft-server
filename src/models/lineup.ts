import { Schema, model, Document, Types } from "mongoose";

export interface ILineupPlayer {
  positionKey: string; // e.g. "pos_0", "pos_1", or position role "GK", "DF_LEFT"
  playerId: Types.ObjectId | null;
}

export interface ILineup extends Document {
  formation: string; // e.g. "4-4-2", "4-3-3"
  players: ILineupPlayer[];
  updatedAt: Date;
}

const LineupPlayerSchema = new Schema<ILineupPlayer>({
  positionKey: {
    type: String,
    required: true,
  },
  playerId: {
    type: Schema.Types.ObjectId,
    ref: "Player",
    default: null,
  },
}, { _id: false });

const LineupSchema = new Schema<ILineup>(
  {
    formation: {
      type: String,
      required: true,
      default: "4-4-2",
    },
    players: {
      type: [LineupPlayerSchema],
      required: true,
      validate: [
        (val: ILineupPlayer[]) => val.length === 11,
        "Lineup must contain exactly 11 player positions",
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const Lineup = model<ILineup>("Lineup", LineupSchema);
