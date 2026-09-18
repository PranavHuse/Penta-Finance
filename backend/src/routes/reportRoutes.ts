import { Router } from "express";
import { exportTransactions } from "../controllers/reportController";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/export", asyncHandler(exportTransactions));

export default router;