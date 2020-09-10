enum ServerErrorType {
  GIVEN_INPUT_IS_INVALID,
  RECORD_IS_MISSING,

  FILE_MEDIA_TYPE_IS_UNEXPECTED,
  FILE_MEDIA_TYPE_IS_UNSUPPORTED,

  USER_CURRENT_PASSWORD_CONFIRMATION_DOES_NOT_MATCH,
  USER_EMAIL_IS_ALREADY_IN_USE,
  USER_PASSWORD_CONFIRMATION_DOES_NOT_MATCH,
  USER_TRIED_TO_LOGIN_WITH_WRONG_CREDENTIALS,
  USER_USERNAME_IS_ALREADY_IN_USE,
}

class ServerError extends Error {
  readonly name: string;
  readonly message: string;
  readonly statusCode: number = 400;

  constructor(type: ServerErrorType, ...args) {
    super();

    this.name = ServerErrorType[type];
    this.message = `ServerError.${this.name}: `;

    switch (type) {
      case ServerErrorType.GIVEN_INPUT_IS_INVALID: {
        this.message += `${args[0]}`;
        break;
      }
      case ServerErrorType.RECORD_IS_MISSING: {
        this.message += `There aren't any records with given information.`;
        break;
      }

      case ServerErrorType.FILE_MEDIA_TYPE_IS_UNEXPECTED: {
        this.message += `${args[0]} was expected, but '${args[1]}' is received.`;
        break;
      }
      case ServerErrorType.FILE_MEDIA_TYPE_IS_UNSUPPORTED: {
        this.message += `'${args[0]}' is not supported.`;
        this.statusCode = 415;
        break;
      }

      case ServerErrorType.USER_CURRENT_PASSWORD_CONFIRMATION_DOES_NOT_MATCH: {
        this.message += `Given password does not match with your current password.`;
        break;
      }
      case ServerErrorType.USER_EMAIL_IS_ALREADY_IN_USE: {
        this.message += `'${args[0]}' is already in use.`;
        break;
      }
      case ServerErrorType.USER_PASSWORD_CONFIRMATION_DOES_NOT_MATCH: {
        this.message += `Given password and password confirmation are mismatched.`;
        break;
      }
      case ServerErrorType.USER_TRIED_TO_LOGIN_WITH_WRONG_CREDENTIALS: {
        this.message += `Given email or password is wrong.`;
        break;
      }
      case ServerErrorType.USER_USERNAME_IS_ALREADY_IN_USE: {
        this.message += `'${args[0]}' is already in taken.`;
        break;
      }
    }
  }
}

export { ServerError, ServerErrorType };
