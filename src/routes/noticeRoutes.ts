import { Router } from "express";
import { getNotices, createNotice, deleteNotice } from "../controllers/noticeController";
import { protect, restrictTo } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", protect as any, getNotices);
router.post("/", protect as any, restrictTo("Admin") as any, createNotice);
router.delete("/:id", protect as any, restrictTo("Admin") as any, deleteNotice);

export default router;
