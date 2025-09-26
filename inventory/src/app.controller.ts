import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Put(':inventoryId')
  getHello(
    @Param('inventoryId') inventoryId,
    @Body()
    payload: { acquiredQuantity: number; updatedAt: string; userId: string },
  ) {
    console.log('payload.updatedAt', payload.updatedAt);
    const updatedAt = new Date(payload.updatedAt);

    // Validate the date
    if (isNaN(updatedAt.getTime())) {
      throw new Error('Invalid updatedAt date format');
    }
    const updatedAtUTC = new Date(updatedAt.toISOString());

    console.log(inventoryId, payload, updatedAtUTC);
    return this.appService.updateInventory(
      inventoryId,
      payload.acquiredQuantity,
      payload.userId,
      updatedAtUTC,
    );
  }
}
