import * as dotenv from 'dotenv';

import * as helpers from 'src/shared/helpers/config.helper';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.dev.env',
});

export default {
  production: process.env.NODE_ENV === 'production',

  port: helpers.parseIntFromEnvOrDefault('PORT', 5000),
};
