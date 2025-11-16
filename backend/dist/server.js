"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
// If local Mongo is not available, use an in-memory Mongo for dev/testing
async function start() {
    try {
        await mongoose_1.default.connect(config_1.default.mongoUri);
        console.log('MongoDB connected (real)');
    }
    catch (err) {
        console.warn('Could not connect to MongoDB at', config_1.default.mongoUri);
        console.warn('Falling back to in-memory MongoDB for development');
        try {
            // lazy import to avoid adding overhead in production
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose_1.default.connect(uri);
            console.log('MongoDB connected (in-memory)');
        }
        catch (memErr) {
            console.error('Failed to start in-memory MongoDB', memErr);
            process.exit(1);
        }
    }
    app_1.default.listen(config_1.default.port, () => {
        console.log(`Server listening on port ${config_1.default.port}`);
    });
}
start();
