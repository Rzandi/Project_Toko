"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoicesController_1 = require("../controllers/invoicesController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const validation_1 = require("../middlewares/validation");
const validationSchemas_1 = require("../schemas/validationSchemas");
const router = (0, express_1.Router)();
router.get('/', auth_1.default, invoicesController_1.listInvoices);
router.post('/', auth_1.default, (0, validation_1.validate)(validationSchemas_1.createInvoiceSchema), invoicesController_1.createInvoice);
router.get('/number/next', auth_1.default, invoicesController_1.getNextInvoiceNumber);
router.get('/:id', auth_1.default, invoicesController_1.getInvoice);
router.put('/:id', auth_1.default, (0, validation_1.validate)(validationSchemas_1.updateInvoiceSchema), invoicesController_1.updateInvoice);
router.delete('/:id', auth_1.default, invoicesController_1.deleteInvoice);
exports.default = router;
