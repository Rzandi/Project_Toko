"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionsController_1 = require("../controllers/transactionsController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const validation_1 = require("../middlewares/validation");
const validationSchemas_1 = require("../schemas/validationSchemas");
const router = (0, express_1.Router)();
// All transaction routes require auth
router.use(auth_1.default);
// List transactions with filters
router.get("/", transactionsController_1.listTransactions);
// Create transaction
router.post("/", (0, validation_1.validate)(validationSchemas_1.createTransactionSchema), transactionsController_1.createTransaction);
// Get single transaction
router.get("/:id", transactionsController_1.getTransaction);
// Update transaction
router.put("/:id", (0, validation_1.validate)(validationSchemas_1.createTransactionSchema), transactionsController_1.updateTransaction);
// Delete transaction
router.delete("/:id", transactionsController_1.deleteTransaction);
exports.default = router;
