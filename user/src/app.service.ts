import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService,
    private amqpConnection: AmqpConnection,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  emitEvent() {
    const client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'my_queue',
        queueOptions: { durable: true },
      },
    });

    client.emit('check_message', { key: 'Hello world' });
    console.log('EVENT EMITTED');
  }

  async placeOrder(userId: number, amount: number) {
    try {
      const order = await this.prismaService.order.create({
        data: { userId, amount },
      });
      await this.amqpConnection.publish(
        'success_exchange',
        'order.placed',
        {
          orderId: order.id,
          userId,
          amount,
        },
        { persistent: true },
      );
      return { success: true, order };
    } catch (error) {
      await this.amqpConnection.publish(
        'failure_exchange',
        'order.placed',
        {
          error: error?.message,
          userId,
          amount,
        },
        { persistent: true },
      );
      throw error;
    }
  }

  // Subscribe to failures (e.g., for logging/alerts)
  @RabbitSubscribe({
    exchange: 'failure_exchange',
    routingKey: '#', // Listen to all failures
    queue: 'user_queue_failures',
    queueOptions: {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'dlx_exchange',
        'x-dead-letter-routing-key': 'retry.failure',
        'x-message-ttl': 5000, // Retry delay
      },
    },
  })
  public handleFailures(msg: any) {
    console.log('Failure received:', msg);
  }
}
