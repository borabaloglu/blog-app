import * as validator from 'class-validator';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

export interface FileInformation {
  ext: string;
  type: string;
  length?: number;
}

export default {
  extractFileInformation(file: any): FileInformation {
    if (!validator.isDefined(file.mimetype)) {
      throw new ServerError(ServerErrorType.FILE_MEDIA_TYPE_IS_UNSUPPORTED, file.mimetype);
    }

    const fileMimetypeParts: string[] = file.mimetype.split('/');
    if (fileMimetypeParts.length < 2) {
      throw new ServerError(ServerErrorType.FILE_MEDIA_TYPE_IS_UNSUPPORTED, file.mimetype);
    }

    return {
      type: fileMimetypeParts[0],
      ext: fileMimetypeParts[1],
    };
  },

  validateFileInformation(file: any, expectedMimeTypes: string[]): FileInformation {
    const fileInformation = this.extractFileInformation(file);

    if (!expectedMimeTypes.includes(fileInformation.type)) {
      throw new ServerError(
        ServerErrorType.FILE_MEDIA_TYPE_IS_UNEXPECTED,
        expectedMimeTypes.join(' or '),
        fileInformation.type,
      );
    }

    return fileInformation;
  },
};
