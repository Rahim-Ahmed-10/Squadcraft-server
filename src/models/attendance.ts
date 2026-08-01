import { Schema, model, Document, Types } from "mongoose";

export interface IAttendanceRecord {
  playerId: Types.ObjectId;
  status: "Present" | "Absent" | "Late";
}

export interface IAttendance extends Document {
  date: string; // YYYY-MM-DD
  records: IAttendanceRecord[];
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>({
  playerId: {
    type: Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late"],
    required: true,
  },
}, { _id: false });

const AttendanceSchema = new Schema<IAttendance>(
  {
    date: {
      type: String,
      required: true,
      unique: true, // One record per day
    },
    records: {
      type: [AttendanceRecordSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Attendance = model<IAttendance>("Attendance", AttendanceSchema);
