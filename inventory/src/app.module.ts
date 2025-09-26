import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
