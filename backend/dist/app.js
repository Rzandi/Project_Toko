"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = __importDefault(require("./routes"));
const validation_1 = require("./middlewares/validation");
const app = (0, express_1.default)();
// Trust proxy - untuk Railway/production
app.set("trust proxy", 1);
// Basic middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
// Rate limiter (basic)
const limiter = (0, express_rate_limit_1.default)({ windowMs: 60 * 1000, max: 200 });
app.use(limiter);
// Rate limiting middleware for auth routes
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many authentication attempts from this IP, please try again after 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/v1/auth", authLimiter);
// routes
app.use("/api/v1", routes_1.default);
// health
app.get("/health", (req, res) => res.json({ ok: true }));
// global error handler
app.use(validation_1.errorHandler);
exports.default = app;
