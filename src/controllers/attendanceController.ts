import { Request, Response } from "express";
import { Attendance } from "../models/attendance";

// Get attendance records for a specific date
export const getAttendanceByDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      res.status(400).json({ message: "Date parameter is required in YYYY-MM-DD format" });
      return;
    }

    const record = await Attendance.findOne({ date }).populate("records.playerId");
    
    if (!record) {
      res.status(200).json({ date, records: [] });
      return;
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance records", error });
  }
};

// Save attendance records (create or update)
export const saveAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, records } = req.body;

    if (!date || !records || !Array.isArray(records)) {
      res.status(400).json({ message: "Invalid parameters. Date and records array are required." });
      return;
    }

    let record = await Attendance.findOne({ date });

    if (record) {
      record.records = records;
      await record.save();
    } else {
      record = new Attendance({ date, records });
      await record.save();
    }

    const populated = await Attendance.findById(record._id).populate("records.playerId");
    res.status(200).json(populated);
  } catch (error) {
    res.status(400).json({ message: "Failed to save attendance record", error });
  }
};
