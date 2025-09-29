import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('place')
  async placeOrder(@Body() body: { userId: number; amount: number }) {
    return this.appService.placeOrder(body.userId, body.amount);
  }

  @EventPattern('check_message')
  handleCheckMessage(@Payload() data: any) {
    console.log('INVENTORY received payload:', data);
    // Add your logic here
    return `INVENTORY processed: ${JSON.stringify(data)}`;
  }
}
