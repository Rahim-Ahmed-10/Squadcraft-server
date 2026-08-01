import { Router } from "express";
import { getAttendanceByDate, saveAttendance } from "../controllers/attendanceController";
import { protect, restrictTo } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", protect as any, getAttendanceByDate);
router.post("/", protect as any, restrictTo("Admin") as any, saveAttendance);

export default router;
