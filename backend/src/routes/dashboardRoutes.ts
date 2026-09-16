import { Router } from "express";
import { getSummary, getTrend } from "../controllers/dashboardController";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth); // PRD 4.1: all /api/dashboard/* routes require a valid JWT

router.get("/summary", asyncHandler(getSummary));
router.get("/trend", asyncHandler(getTrend));

export default router;