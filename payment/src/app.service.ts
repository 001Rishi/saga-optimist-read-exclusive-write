import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly amqpConnection: AmqpConnection,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  @RabbitSubscribe({
    exchange: 'success_exchange',
    routingKey: 'order.placed',
    queue: 'payment_queue_order_placed',
    queueOptions: {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'dlx_exchange',
        'x-dead-letter-routing-key': 'retry.order.placed',
      },
    },
  })
  async handleOrderPlaced(msg: {
    orderId: number;
    userId: number;
    amount: number;
  }) {
    try {
      // Simulate payment processing
      if (Math.random() > 0.2) {
        // 80% success
        const payment = await this.prismaService.payment.create({
          data: { orderId: msg.orderId, amount: msg.amount, status: 'success' },
        });
        await this.amqpConnection.publish(
          'success_exchange',
          'payment.processed',
          {
            paymentId: payment.id,
            orderId: msg.orderId,
          },
          { persistent: true },
        );
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      await this.amqpConnection.publish(
        'failure_exchange',
        'payment.processed',
        {
          error: error.message,
          orderId: msg.orderId,
        },
        { persistent: true },
      );
      // Nack for retry (up to 3 times, then DLQ)
      throw error; // This will nack the message
    }
  }
}
