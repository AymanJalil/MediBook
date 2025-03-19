import { Controller, Get, NotFoundException } from '@nestjs/common';

@Controller('g')
export class GenericController {
  @Get()
  getGeneric(): void {
    throw new NotFoundException('This route is not implemented.');
  }
}
