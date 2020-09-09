import * as helpers from 'src/shared/helpers/config.helper';

export default {
  jwt: {
    secret: helpers.loadEnvOrError('JWT_SECRET'),
  },
  crypto: {
    hashAlgorithm: 'sha256',
  },
};
