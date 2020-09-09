enum ServerErrorType {
  GIVEN_INPUT_IS_INVALID,
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
    }
  }
}

export { ServerError, ServerErrorType };
