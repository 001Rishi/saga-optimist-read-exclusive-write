import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('check_message')
  async checkMessage(data: any, context: RmqContext) {
    console.log('listening payload', data);
  }
}
