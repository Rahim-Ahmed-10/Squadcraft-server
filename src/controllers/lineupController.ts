import { Request, Response } from "express";
import { Lineup, ILineupPlayer } from "../models/lineup";

// Helper to generate default empty player lineup with 11 slots
const createDefaultLineupPlayers = (): ILineupPlayer[] => {
  return Array.from({ length: 11 }, (_, i) => ({
    positionKey: `pos_${i}`,
    playerId: null,
  }));
};

// Fetch current lineup (singleton design: get the active one, or initialize default)
export const getLineup = async (req: Request, res: Response): Promise<void> => {
  try {
    let lineup = await Lineup.findOne().populate("players.playerId");
    
    if (!lineup) {
      // Create a default lineup if database is empty
      lineup = new Lineup({
        formation: "4-4-2",
        players: createDefaultLineupPlayers(),
      });
      await lineup.save();
    }

    res.status(200).json(lineup);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lineup", error });
  }
};

// Save lineup (upsert current lineup)
export const saveLineup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { formation, players } = req.body;

    if (!formation || !players || !Array.isArray(players) || players.length !== 11) {
      res.status(400).json({ message: "Invalid lineup details. Must have formation and exactly 11 player assignments." });
      return;
    }

    let lineup = await Lineup.findOne();

    if (lineup) {
      lineup.formation = formation;
      lineup.players = players;
      await lineup.save();
    } else {
      lineup = new Lineup({ formation, players });
      await lineup.save();
    }

    // Populate and return updated lineup
    const populated = await Lineup.findById(lineup._id).populate("players.playerId");
    res.status(200).json(populated);
  } catch (error) {
    res.status(400).json({ message: "Failed to save lineup", error });
  }
};
