"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextInvoiceNumber = exports.deleteInvoice = exports.updateInvoice = exports.getInvoice = exports.createInvoice = exports.listInvoices = void 0;
const Invoice_1 = __importDefault(require("../models/Invoice"));
const Client_1 = __importDefault(require("../models/Client"));
const Counter_1 = __importDefault(require("../models/Counter"));
const validation_1 = require("../middlewares/validation");
const listInvoices = async (req, res, next) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const { status, startDate, endDate, clientId, skip = 0, limit = 10 } = req.query;
        const query = { user: userId };
        if (status)
            query.status = status;
        if (startDate || endDate) {
            query.issuedDate = {};
            if (startDate)
                query.issuedDate.$gte = new Date(startDate);
            if (endDate)
                query.issuedDate.$lte = new Date(endDate);
        }
        if (clientId)
            query.client = clientId;
        const items = await Invoice_1.default.find(query)
            .populate('client')
            .sort({ createdAt: -1 })
            .skip(Number(skip))
            .limit(Number(limit));
        const total = await Invoice_1.default.countDocuments(query);
        res.json({
            success: true,
            data: items,
            pagination: {
                total,
                skip: Number(skip),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.listInvoices = listInvoices;
const createInvoice = async (req, res, next) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const { client, items, issuedDate, dueDate, currency, notes } = req.body;
        if (!client || !items || !Array.isArray(items) || items.length === 0) {
            throw new validation_1.AppError(400, 'Invalid invoice data');
        }
        let clientId;
        if (typeof client === 'string') {
            clientId = client;
        }
        else if (client && client.name) {
            const c = await Client_1.default.create({ ...client, user: userId });
            clientId = c._id;
        }
        if (!clientId)
            throw new validation_1.AppError(400, 'Client is required');
        // get counter for invoice numbering
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth() + 1;
        const counter = await Counter_1.default.findOneAndUpdate({ user: userId, series: 'default', year, month }, { $inc: { seq: 1 } }, { upsert: true, new: true });
        const seq = (counter.seq || 0).toString().padStart(4, '0');
        const invoiceNumber = `INV-${year}-${String(month).padStart(2, '0')}-${seq}`;
        // Map frontend field names to backend field names
        const mappedItems = items.map((item) => ({
            desc: item.description || item.desc,
            qty: item.quantity || item.qty,
            unitPrice: item.unitPrice,
            taxPct: item.tax || item.taxPct || 0,
        }));
        const inv = await Invoice_1.default.create({
            user: userId,
            number: invoiceNumber,
            client: clientId,
            items: mappedItems,
            issuedDate: issuedDate || new Date(),
            dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            currency: currency || 'IDR',
            status: 'draft',
        });
        // computeTotals is called by pre-save hook
        const populated = await inv.populate('client');
        res.status(201).json({ success: true, data: populated });
    }
    catch (err) {
        next(err);
    }
};
exports.createInvoice = createInvoice;
const getInvoice = async (req, res, next) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const { id } = req.params;
        const inv = await Invoice_1.default.findById(id).populate('client');
        if (!inv || inv.user.toString() !== userId) {
            throw new validation_1.AppError(404, 'Invoice not found');
        }
        res.json({ success: true, data: inv });
    }
    catch (err) {
        next(err);
    }
};
exports.getInvoice = getInvoice;
const updateInvoice = async (req, res, next) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const { id } = req.params;
        const { client, items, issuedDate, dueDate, currency, notes, status } = req.body;
        const inv = await Invoice_1.default.findById(id);
        if (!inv || inv.user.toString() !== userId) {
            throw new validation_1.AppError(404, 'Invoice not found');
        }
        if (status && !['draft', 'sent', 'paid', 'overdue', 'cancelled'].includes(status)) {
            throw new validation_1.AppError(400, 'Invalid status');
        }
        if (items && Array.isArray(items) && items.length > 0) {
            // Map frontend field names to backend field names
            const mappedItems = items.map((item) => ({
                desc: item.description || item.desc,
                qty: item.quantity || item.qty,
                unitPrice: item.unitPrice,
                taxPct: item.tax || item.taxPct || 0,
            }));
            inv.items = mappedItems;
        }
        if (client && typeof client === 'string')
            inv.client = client;
        if (issuedDate)
            inv.issuedDate = new Date(issuedDate);
        if (dueDate)
            inv.dueDate = new Date(dueDate);
        if (currency)
            inv.currency = currency;
        if (notes !== undefined)
            inv.notes = notes;
        if (status)
            inv.status = status;
        await inv.save();
        const populated = await inv.populate('client');
        res.json({ success: true, data: populated });
    }
    catch (err) {
        next(err);
    }
};
exports.updateInvoice = updateInvoice;
const deleteInvoice = async (req, res, next) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const { id } = req.params;
        const inv = await Invoice_1.default.findById(id);
        if (!inv || inv.user.toString() !== userId) {
            throw new validation_1.AppError(404, 'Invoice not found');
        }
        await Invoice_1.default.deleteOne({ _id: id });
        res.json({ success: true, message: 'Invoice deleted successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteInvoice = deleteInvoice;
const getNextInvoiceNumber = async (req, res, next) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth() + 1;
        const counter = await Counter_1.default.findOneAndUpdate({ user: userId, series: 'default', year, month }, { $inc: { seq: 1 } }, { upsert: true, new: true });
        const seq = (counter.seq || 0).toString().padStart(4, '0');
        const invoiceNumber = `INV-${year}-${String(month).padStart(2, '0')}-${seq}`;
        res.json({ success: true, data: { invoiceNumber } });
    }
    catch (err) {
        next(err);
    }
};
exports.getNextInvoiceNumber = getNextInvoiceNumber;
