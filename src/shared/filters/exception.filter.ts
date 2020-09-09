import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(exception.statusCode || 500).send(exception);
  }
}
