import { SequelizeModuleOptions } from '@nestjs/sequelize';

import * as helpers from 'src/shared/helpers/config.helper';

const config: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: helpers.loadEnvOrError('DB_HOST'),
  port: helpers.loadEnvOrError('DB_PORT', true),
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
  native: true,
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
  },
  define: {
    underscored: false,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  database: helpers.loadEnvOrError('DB_NAME'),
  username: helpers.loadEnvOrError('DB_USERNAME'),
  password: helpers.loadEnvOrError('DB_PASSWORD'),
  models: ['modules/**/entities/*{.js,.ts}'],
  sync: {
    force: false,
    alter: true,
  },
  synchronize: true,
  autoLoadModels: true,
};

export default config;
