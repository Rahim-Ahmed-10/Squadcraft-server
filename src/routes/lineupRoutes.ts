import { Router } from "express";
import { getLineup, saveLineup } from "../controllers/lineupController";
import { protect, restrictTo } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", protect as any, getLineup);
router.post("/", protect as any, restrictTo("Admin") as any, saveLineup);

export default router;
