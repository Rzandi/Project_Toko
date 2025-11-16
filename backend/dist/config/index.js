"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envPath = path_1.default.resolve(process.cwd(), '.env');
dotenv_1.default.config({ path: envPath });
exports.default = {
    port: process.env.PORT || 4000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/invoice-ease',
    jwtSecret: process.env.JWT_SECRET || 'please-change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
};
