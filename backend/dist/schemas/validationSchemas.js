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
exports.createClientSchema = exports.updateInvoiceSchema = exports.createInvoiceSchema = exports.createTransactionSchema = exports.loginSchema = exports.registerSchema = void 0;
const yup = __importStar(require("yup"));
// Auth validation schemas
exports.registerSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    business: yup.object().shape({
        name: yup.string(),
        npwp: yup.string(),
        address: yup.string(),
    }),
});
exports.loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
});
// Transaction validation schema (for create/update)
exports.createTransactionSchema = yup.object().shape({
    type: yup
        .string()
        .oneOf(["INCOME", "EXPENSE", "income", "expense"], "Type must be INCOME or EXPENSE")
        .required("Type is required"),
    date: yup.date().required("Date is required"),
    amount: yup
        .number()
        .positive("Amount must be positive")
        .required("Amount is required"),
    currency: yup.string().default("IDR"),
    category: yup.string().required("Category is required"),
    description: yup
        .string()
        .required("Description is required")
        .min(3, "Description must be at least 3 characters"),
    paymentMethod: yup.string(),
    notes: yup.string(),
});
// Invoice validation schema
exports.createInvoiceSchema = yup.object().shape({
    client: yup.mixed().required("Client is required"), // can be ID string or object
    items: yup
        .array()
        .of(yup.object().shape({
        description: yup.string().required("Item description required"),
        quantity: yup.number().positive().required("Quantity required"),
        unitPrice: yup.number().positive().required("Unit price required"),
        tax: yup.number().min(0).max(100),
    }))
        .min(1, "At least one item required"),
    issuedDate: yup.date(),
    dueDate: yup.date(),
    currency: yup.string().default("IDR"),
    notes: yup.string(),
});
exports.updateInvoiceSchema = yup.object().shape({
    client: yup.mixed(),
    items: yup
        .array()
        .of(yup.object().shape({
        description: yup.string().required("Item description required"),
        quantity: yup.number().positive().required("Quantity required"),
        unitPrice: yup.number().positive().required("Unit price required"),
        tax: yup.number().min(0).max(100),
    }))
        .min(1, "At least one item required"),
    issuedDate: yup.date(),
    dueDate: yup.date(),
    currency: yup.string(),
    notes: yup.string(),
    status: yup.string().oneOf(["draft", "sent", "paid", "overdue", "cancelled"]),
});
// Client validation schema
exports.createClientSchema = yup.object().shape({
    name: yup.string().required("Client name is required"),
    email: yup.string().email("Invalid email"),
    phone: yup.string(),
    address: yup.string(),
    notes: yup.string(),
});
