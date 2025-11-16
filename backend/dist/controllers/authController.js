"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const config_1 = __importDefault(require("../config"));
const validation_1 = require("../middlewares/validation");
const register = async (req, res, next) => {
    try {
        const { email, password, business } = req.body;
        const existing = await User_1.default.findOne({ email });
        if (existing)
            throw new validation_1.AppError(409, 'Email already registered');
        const hash = password ? await bcryptjs_1.default.hash(password, 10) : undefined;
        const user = await User_1.default.create({ email, passwordHash: hash, business });
        const accessToken = jsonwebtoken_1.default.sign({ sub: user._id }, config_1.default.jwtSecret, { expiresIn: config_1.default.jwtExpiresIn });
        res.status(201).json({ success: true, data: { user: { id: user._id, email: user.email, business: user.business }, tokens: { accessToken } } });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user)
            throw new validation_1.AppError(401, 'Invalid credentials');
        const ok = user.passwordHash ? await bcryptjs_1.default.compare(password, user.passwordHash) : false;
        if (!ok)
            throw new validation_1.AppError(401, 'Invalid credentials');
        const accessToken = jsonwebtoken_1.default.sign({ sub: user._id }, config_1.default.jwtSecret, { expiresIn: config_1.default.jwtExpiresIn });
        res.json({ success: true, data: { user: { id: user._id, email: user.email, business: user.business }, tokens: { accessToken } } });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const me = async (req, res, next) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const user = await User_1.default.findById(userId).select('-passwordHash');
        if (!user)
            throw new validation_1.AppError(404, 'User not found');
        res.json({ success: true, data: user });
    }
    catch (err) {
        next(err);
    }
};
exports.me = me;
