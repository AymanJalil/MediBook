import { HttpException, HttpStatus } from '@nestjs/common';

export class ThrottlerException extends HttpException {
  constructor(message?: string) {
    super(message || 'Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
  }
}
