import { Request, Response } from "express";
import { Notice } from "../models/notice";

// Get all notices
export const getNotices = async (req: Request, res: Response): Promise<void> => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notices", error });
  }
};

// Create a notice
export const createNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, category } = req.body;
    const newNotice = new Notice({ title, content, category });
    await newNotice.save();
    res.status(201).json(newNotice);
  } catch (error) {
    res.status(400).json({ message: "Failed to create notice", error });
  }
};

// Delete a notice
export const deleteNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedNotice = await Notice.findByIdAndDelete(id);

    if (!deletedNotice) {
      res.status(404).json({ message: "Notice not found" });
      return;
    }

    res.status(200).json({ message: "Notice deleted successfully", id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notice", error });
  }
};
