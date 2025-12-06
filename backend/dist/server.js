"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
async function start() {
    try {
        console.log("Connecting to MongoDB at:", config_1.default.mongoUri);
        await mongoose_1.default.connect(config_1.default.mongoUri);
        console.log("✅ MongoDB connected successfully");
        app_1.default.listen(config_1.default.port, () => {
            console.log(`✅ Server listening on port ${config_1.default.port}`);
        });
    }
    catch (err) {
        console.error("❌ Failed to connect to MongoDB:", err);
        console.error("MONGO_URI:", config_1.default.mongoUri);
        process.exit(1);
    }
}
start();
