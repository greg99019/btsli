"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
require("dotenv/config");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const app_module_1 = require("../src/app.module");
const express = require("express");
const server = express();
let isBootstrapped = false;
async function bootstrap() {
    if (!isBootstrapped) {
        const adapter = new platform_express_1.ExpressAdapter(server);
        const app = await core_1.NestFactory.create(app_module_1.AppModule, adapter, { logger: false });
        app.enableCors({ origin: true, credentials: true });
        await app.init();
        isBootstrapped = true;
    }
}
async function handler(req, res) {
    await bootstrap();
    server(req, res);
}
//# sourceMappingURL=index.js.map