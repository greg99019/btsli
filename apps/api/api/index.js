'use strict';
require('dotenv/config');

const express = require('express');
const server = express();
let isReady = false;

async function bootstrap() {
  if (!isReady) {
    const { NestFactory } = require('@nestjs/core');
    const { ExpressAdapter } = require('@nestjs/platform-express');
    const { AppModule } = require('../dist/src/app.module');

    const adapter = new ExpressAdapter(server);
    const app = await NestFactory.create(AppModule, adapter, { logger: false });
    app.enableCors({ origin: true, credentials: true });
    await app.init();
    isReady = true;
  }
}

module.exports = async (req, res) => {
  await bootstrap();
  server(req, res);
};
