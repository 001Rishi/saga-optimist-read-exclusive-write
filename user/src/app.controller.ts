import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('check_message')
  async handleCheckMessage(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('INVENTORY received payload:', data);
    // Add your logic here
    return `INVENTORY processed: ${JSON.stringify(data)}`;
  }
}
