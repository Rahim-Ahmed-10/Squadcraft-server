import { Router } from "express";
import { getPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer } from "../controllers/playerController";
import { protect, restrictTo } from "../middlewares/authMiddleware";

const router = Router();

// Publicly accessible reads
router.get("/", getPlayers);
router.get("/:id", getPlayerById);

// Admin-only actions
router.post("/", protect as any, restrictTo("Admin") as any, createPlayer);
router.put("/:id", protect as any, restrictTo("Admin") as any, updatePlayer);
router.delete("/:id", protect as any, restrictTo("Admin") as any, deletePlayer);

export default router;
