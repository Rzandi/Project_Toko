"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
function authMiddleware(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer "))
        return res
            .status(401)
            .json({ success: false, error: { message: "Unauthorized" } });
    const token = auth.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        // @ts-ignore
        req.userId = payload.sub;
        next();
    }
    catch (err) {
        return res
            .status(401)
            .json({ success: false, error: { message: "Invalid token" } });
    }
}
