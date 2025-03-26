// app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(
    // @InjectConnection() private readonly mongoConnection: Connection,
  ) {}

  @Get('health') // Changed endpoint to /health
  async healthCheck() {
    return {
      status: 'ok',
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
