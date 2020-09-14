import { ParseIntPipe } from '@nestjs/common';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

export class ParseInt extends ParseIntPipe {
  exceptionFactory = () => {
    throw new ServerError(ServerErrorType.GIVEN_INPUT_IS_INVALID, 'numeric string is expected');
  };
}
