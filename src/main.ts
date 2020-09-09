import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationError } from 'class-validator';

import envConfig from 'src/shared/configs/env.config';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';
import { GlobalExceptionFilter } from 'src/shared/filters/exception.filter';

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
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const errorMessages: string[] = [];
        validationErrors.forEach((error: ValidationError) => {
          Object.keys(error.constraints).forEach((key: string) => {
            errorMessages.push(error.constraints[key]);
          });
        });
        return new ServerError(ServerErrorType.GIVEN_INPUT_IS_INVALID, errorMessages.join(','));
      },
    }),
  );

  await app.listen(envConfig.port, process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');
})();
