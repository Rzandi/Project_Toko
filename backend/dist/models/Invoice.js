"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const InvoiceItemSchema = new mongoose_1.Schema({
    desc: { type: String, required: true },
    qty: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    taxPct: { type: Number, default: 0 },
}, { _id: false });
const InvoiceSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    number: { type: String, required: true, index: true },
    series: { type: String },
    status: {
        type: String,
        enum: ["draft", "sent", "overdue", "paid", "partial"],
        default: "draft",
    },
    client: { type: mongoose_1.Schema.Types.ObjectId, ref: "Client" },
    clientSnapshot: {
        name: String,
        email: String,
        address: String,
        phone: String,
    },
    items: { type: [InvoiceItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: "IDR" },
    issuedDate: { type: Date },
    dueDate: { type: Date },
    paidDate: { type: Date },
    pdfUrl: { type: String },
}, { timestamps: true });
// convenience method to compute totals
InvoiceSchema.methods.computeTotals = function () {
    const items = this.items || [];
    const subtotal = items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
    const tax = items.reduce((t, it) => t + Math.round((it.qty * it.unitPrice * (it.taxPct || 0)) / 100), 0);
    this.subtotal = subtotal;
    this.tax = tax;
    this.total = subtotal + tax;
};
InvoiceSchema.pre("save", function (next) {
    // recalc totals before save
    // @ts-ignore
    if (this.items)
        this.computeTotals();
    next();
});
InvoiceSchema.index({ user: 1, number: 1 }, { unique: true });
exports.default = mongoose_1.default.models.Invoice ||
    mongoose_1.default.model("Invoice", InvoiceSchema);
