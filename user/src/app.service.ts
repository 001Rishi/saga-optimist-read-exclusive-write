import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor() {
    this.emitEvent();
  }
  getHello(): string {
    return 'Hello World!';
  }

  async emitEvent() {
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
}
