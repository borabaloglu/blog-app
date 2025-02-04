enum ServerErrorType {
  GIVEN_INPUT_IS_INVALID,
  PROPERTY_IS_MISSING,
  RECORD_IS_MISSING,

  FILE_MEDIA_TYPE_IS_UNEXPECTED,
  FILE_MEDIA_TYPE_IS_UNSUPPORTED,

  LOOKUP_START_PAGE_IS_BIGGER_THAN_STOP_PAGE,
  LOOKUP_START_RANGE_IS_BIGGER_THAN_STOP_RANGE,
  LOOKUP_UNKNOWN_LOAD_ATTRIBUTE,
  LOOKUP_UNKNOWN_ORDER_ATTRIBUTE,

  FRIENDSHIP_ALREADY_FOLLOWING,
  FRIENDSHIP_TRIED_TO_FOLLOW_SELF,

  POST_TRIED_TO_CREATE_WITH_SAME_TITLE,

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
      case ServerErrorType.PROPERTY_IS_MISSING: {
        this.message += `'${args[0]}' was required but it's not provided.`;
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

      case ServerErrorType.LOOKUP_START_PAGE_IS_BIGGER_THAN_STOP_PAGE: {
        this.message += `Provided start page '${args[0]}' is bigger than provided stop page '${args[1]}'.`;
        break;
      }
      case ServerErrorType.LOOKUP_START_RANGE_IS_BIGGER_THAN_STOP_RANGE: {
        this.message += `Provided start range '${args[0]}' is bigger than provided stop range '${args[1]}'.`;
        break;
      }
      case ServerErrorType.LOOKUP_UNKNOWN_ORDER_ATTRIBUTE: {
        this.message += `Cannot order by the attribute '${args[0]}' because it's not known.`;
        break;
      }
      case ServerErrorType.LOOKUP_UNKNOWN_LOAD_ATTRIBUTE: {
        this.message += `Cannot load the attribute '${args[0]}' because it's not known.`;
        break;
      }

      case ServerErrorType.FRIENDSHIP_ALREADY_FOLLOWING: {
        this.message += `You are already following this user.`;
        break;
      }
      case ServerErrorType.FRIENDSHIP_TRIED_TO_FOLLOW_SELF: {
        this.message += `You cannot follow yourself.`;
        break;
      }

      case ServerErrorType.POST_TRIED_TO_CREATE_WITH_SAME_TITLE: {
        this.message += `You cannot create posts with same titles.`;
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
