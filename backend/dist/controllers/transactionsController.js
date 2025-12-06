"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = exports.getTransaction = exports.listTransactions = void 0;
const Transaction_1 = __importDefault(require("../models/Transaction"));
const listTransactions = async (req, res, next) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const skip = Number(req.query.skip || 0);
        const limit = Number(req.query.limit || 10);
        const startDate = req.query.startDate
            ? new Date(req.query.startDate)
            : null;
        const endDate = req.query.endDate
            ? new Date(req.query.endDate)
            : null;
        const type = req.query.type;
        const category = req.query.category;
        // Build filter
        const filter = { user: userId };
        if (startDate && endDate) {
            filter.date = { $gte: startDate, $lte: endDate };
        }
        if (type && type !== "ALL") {
            // Accept both uppercase (frontend) and lowercase (DB) formats
            filter.type = type.toUpperCase();
        }
        if (category) {
            filter.category = category;
        }
        const [items, total] = await Promise.all([
            Transaction_1.default.find(filter)
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Transaction_1.default.countDocuments(filter),
        ]);
        const pages = Math.ceil(total / limit);
        res.json({
            success: true,
            data: items,
            pagination: {
                total,
                skip,
                limit,
                pages,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.listTransactions = listTransactions;
const getTransaction = async (req, res, next) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const { id } = req.params;
        const transaction = await Transaction_1.default.findOne({
            _id: id,
            user: userId,
        });
        if (!transaction) {
            return res
                .status(404)
                .json({ success: false, message: "Transaction not found" });
        }
        res.json({ success: true, data: transaction });
    }
    catch (err) {
        next(err);
    }
};
exports.getTransaction = getTransaction;
const createTransaction = async (req, res, next) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const payload = { ...req.body, user: userId };
        const tx = await Transaction_1.default.create(payload);
        res.status(201).json({ success: true, data: tx });
    }
    catch (err) {
        next(err);
    }
};
exports.createTransaction = createTransaction;
const updateTransaction = async (req, res, next) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const { id } = req.params;
        // Verify ownership
        const transaction = await Transaction_1.default.findOne({
            _id: id,
            user: userId,
        });
        if (!transaction) {
            return res
                .status(404)
                .json({ success: false, message: "Transaction not found" });
        }
        // Update allowed fields only
        const updateData = {
            type: req.body.type || transaction.type,
            date: req.body.date || transaction.date,
            amount: req.body.amount || transaction.amount,
            category: req.body.category || transaction.category,
            notes: req.body.notes || transaction.notes,
            currency: req.body.currency || transaction.currency,
        };
        const updated = await Transaction_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        res.json({ success: true, data: updated });
    }
    catch (err) {
        next(err);
    }
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (req, res, next) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const { id } = req.params;
        // Verify ownership
        const transaction = await Transaction_1.default.findOne({
            _id: id,
            user: userId,
        });
        if (!transaction) {
            return res
                .status(404)
                .json({ success: false, message: "Transaction not found" });
        }
        await Transaction_1.default.findByIdAndDelete(id);
        res.json({ success: true, message: "Transaction deleted successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteTransaction = deleteTransaction;
