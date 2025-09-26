import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {
    // this.getUser();
    // const updatedAt = new Date('2025-09-25T13:47:26.804Z');
    // const updatedAtUTC = new Date(updatedAt.toISOString());
    // this.getInventory({
    //   inventoryId: 'f75f59d5-7d69-4f73-a0e0-6a9a52d96cab',
    //   updatedAt: updatedAtUTC,
    // });
  }
  getHello(): string {
    return 'Hello World!';
  }

  async getUser() {
    const data = await this.prisma.inventory.findMany();
    console.log(data);
  }

  async getInventory({
    inventoryId,
    updatedAt,
  }: {
    inventoryId: string;
    updatedAt?: Date;
  }) {
    let inventory = await this.prisma.inventory.findUnique({
      where: {
        id: inventoryId,
        ...(updatedAt ? { updatedAt } : {}),
      },
    });

    console.log('inventory', inventory);

    if (!inventory) {
      inventory = await this.prisma.inventory.findUnique({
        where: {
          id: inventoryId,
        },
      });
      console.log('inventory by id', inventory);
    }

    return inventory;
  }

  async updateInventory(
    // payload: {
    //   id: string;
    //   quantity: number;
    //   updatedAt: Date;
    //   userId: string | null;
    // },
    inventoryId: string,
    quantity: number,
    userId: string,
    updatedAt: Date,
  ) {
    try {
      const updatedInventory = await this.prisma.$transaction(async (tx) => {
        const inventory = await this.getInventory({
          inventoryId: inventoryId,
          updatedAt: updatedAt,
        });

        if (!inventory) {
          throw new Error('Inventory record not found or has been modified');
        }

        const validQ = inventory.quantity - quantity;

        if (validQ < 0) {
          throw new Error('inventory record cannot be modified');
        }

        // Update inventory
        const updated = await tx.inventory.update({
          where: {
            id: inventoryId,
            updatedAt: updatedAt,
          },
          data: {
            quantity: validQ,
            userId,
            updatedAt: new Date(),
          },
        });

        // Log the transaction
        await tx.inventoryTransaction.create({
          data: {
            inventoryId: updated.id,
            userId,
          },
        });

        return updated;
      });

      return updatedInventory;
    } catch (error) {
      if (error.code === 'P2025') {
        // Prisma error for record not found or optimistic lock failure
        throw new Error(
          'Concurrency conflict: Inventory was modified by another process',
        );
      }
      throw error;
    }
  }
}
