import { Router } from "express";
import {
  listTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionsController";
import authMiddleware from "../middlewares/auth";
import { validate } from "../middlewares/validation";
import { createTransactionSchema } from "../schemas/validationSchemas";

const router = Router();

// All transaction routes require auth
router.use(authMiddleware);

// List transactions with filters
router.get("/", listTransactions);

// Create transaction
router.post("/", validate(createTransactionSchema), createTransaction);

// Get single transaction
router.get("/:id", getTransaction);

// Update transaction
router.put("/:id", validate(createTransactionSchema), updateTransaction);

// Delete transaction
router.delete("/:id", deleteTransaction);

export default router;
