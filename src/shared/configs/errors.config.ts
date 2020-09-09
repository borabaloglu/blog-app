enum ServerErrorType {
  GIVEN_INPUT_IS_INVALID,

  USER_EMAIL_IS_ALREADY_IN_USE,
  USER_PASSWORD_CONFIRMATION_DOES_NOT_MATCH,
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

      case ServerErrorType.USER_EMAIL_IS_ALREADY_IN_USE: {
        this.message += `'${args[0]}' is already in use.`;
        break;
      }
      case ServerErrorType.USER_PASSWORD_CONFIRMATION_DOES_NOT_MATCH: {
        this.message += `Given password and password confirmation are mismatched.`;
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
