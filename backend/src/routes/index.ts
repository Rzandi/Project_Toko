import { Router } from "express";
import authRoutes from "./auth";
import transactionsRoutes from "./transactions";
import invoicesRoutes from "./invoices";

const router = Router();

router.use("/auth", authRoutes);
router.use("/transactions", transactionsRoutes);
router.use("/invoices", invoicesRoutes);

export default router;
