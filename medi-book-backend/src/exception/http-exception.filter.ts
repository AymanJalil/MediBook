import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ContextType } from '@nestjs/common/interfaces';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const contextType = host.getType();

    // Handle GraphQL errors differently
    if (contextType === 'graphql' as any) { // Type assertion to avoid TypeScript error
      this.logger.error(
        `GraphQL Error`,
        exception instanceof HttpException ? exception.message : 'Internal server error',
        exception instanceof HttpException ? exception.stack : 'No stack trace'
      );
      // For GraphQL, we don't need to send a response - just let the error propagate
      throw exception;
    }

    // Standard HTTP error handling
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
          ? (exception instanceof HttpException ? exception.message : String(exception))
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