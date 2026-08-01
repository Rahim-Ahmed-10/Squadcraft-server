import { Request, Response } from "express";
import { Player } from "../models/player";

// Get all players
export const getPlayers = async (req: Request, res: Response): Promise<void> => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch players", error });
  }
};

// Get a single player by ID
export const getPlayerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const player = await Player.findById(id);
    if (!player) {
      res.status(404).json({ message: "Player not found" });
      return;
    }
    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch player", error });
  }
};

// Create a new player
export const createPlayer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, position, goals, rating } = req.body;
    const newPlayer = new Player({ name, position, goals, rating });
    await newPlayer.save();
    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(400).json({ message: "Failed to create player", error });
  }
};

// Update a player
export const updatePlayer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, position, goals, rating } = req.body;
    
    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      { name, position, goals, rating },
      { new: true, runValidators: true }
    );

    if (!updatedPlayer) {
      res.status(404).json({ message: "Player not found" });
      return;
    }

    res.status(200).json(updatedPlayer);
  } catch (error) {
    res.status(400).json({ message: "Failed to update player", error });
  }
};

// Delete a player
export const deletePlayer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedPlayer = await Player.findByIdAndDelete(id);

    if (!deletedPlayer) {
      res.status(404).json({ message: "Player not found" });
      return;
    }

    res.status(200).json({ message: "Player deleted successfully", id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete player", error });
  }
};
