import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';

import envConfig from 'src/shared/configs/env.config';

import { AppModule } from 'src/app.module';

(async () => {
  const fastify = new FastifyAdapter({
    logger: {
      file: process.env.NODE_ENV === 'production' ? `./logs/master.log` : undefined,
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
      useLevelLabels: true,
      prettyPrint:
        process.env.NODE_ENV === 'production' ? false : { translateTime: true, levelFirst: true },
    } as any,
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastify);

  await app.listen(envConfig.port, process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');
})();
