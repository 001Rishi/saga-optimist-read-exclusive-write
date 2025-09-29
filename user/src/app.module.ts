import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { PrismaModule } from './prisma/prisma.module'; // You'll create this
import { AppController } from './app.controller';
import { AppService } from './app.service'; // Service-specific

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        { name: 'success_exchange', type: 'topic', options: { durable: true } },
        { name: 'failure_exchange', type: 'topic', options: { durable: true } },
        { name: 'dlx_exchange', type: 'topic', options: { durable: true } }, // Dead-letter exchange
      ],
      uri: process.env.RABBITMQ_URL,
      connectionInitOptions: { wait: false },
      enableControllerDiscovery: true,
    }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}