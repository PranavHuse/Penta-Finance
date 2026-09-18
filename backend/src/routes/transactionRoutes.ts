import { Router } from "express";
import { listTransactions, getTransactionById } from "../controllers/transactionController";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listTransactions));
router.get("/:id", asyncHandler(getTransactionById));

export default router;