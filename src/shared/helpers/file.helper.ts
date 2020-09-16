import * as validator from 'class-validator';

import { fromBuffer } from 'file-type';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

export interface FileInformation {
  mime: string;
  type: string;
  ext: string;
  length?: number;
}

export default {
  async extractFileInformation(file: any): Promise<FileInformation> {
    const fileInformation = await fromBuffer(file);

    if (!validator.isDefined(fileInformation.mime)) {
      throw new ServerError(ServerErrorType.FILE_MEDIA_TYPE_IS_UNSUPPORTED, file.mimetype);
    }

    return {
      mime: fileInformation.mime,
      type: fileInformation.mime.split('/')[0],
      ext: fileInformation.ext,
    };
  },

  async validateFileInformation(file: any, expectedFileTypes: string[]): Promise<FileInformation> {
    const fileInformation = await this.extractFileInformation(file);

    if (!expectedFileTypes.includes(fileInformation.type)) {
      throw new ServerError(
        ServerErrorType.FILE_MEDIA_TYPE_IS_UNEXPECTED,
        expectedFileTypes.join(' or '),
        fileInformation.type,
      );
    }

    return fileInformation;
  },
};
