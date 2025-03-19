import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const request = context.getRequest();
    const method = request ? httpAdapter.getRequestMethod(request) : 'METHOD_UNKNOWN';
    const url = request ? httpAdapter.getRequestUrl(request) : 'URL_UNKNOWN';

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: url,
      method: method,
      message:
        httpStatus !== HttpStatus.INTERNAL_SERVER_ERROR
          ? (exception as HttpException).message || exception
          : 'Internal server error',
    };

    this.logger.error(
      `${method} ${url}`,
      responseBody,
      exception instanceof HttpException ? exception.stack : 'No stack trace'
    );

    httpAdapter.reply(context.getResponse(), responseBody, httpStatus);
  }
}
