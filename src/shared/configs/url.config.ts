import * as helpers from 'src/shared/helpers/config.helper';

export default {
  static: {
    profileImage: `${helpers.loadEnvOrError('DOMAIN')}/profile-images`,
    coverImage: `${helpers.loadEnvOrError('DOMAIN')}/cover-images`,
  },
};
