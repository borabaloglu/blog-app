import * as helpers from 'src/shared/helpers/config.helper';

export default {
  static: {
    profileImage: `${helpers.loadEnvOrError('DOMAIN')}/profile-images`,
  },
};
