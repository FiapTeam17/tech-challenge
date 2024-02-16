import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SqsModule } from './sqs/sqs.module';
import { SqsConsumerModule } from './sqs-consumer/sqs-consumer.module';

@Module({
  imports: [ConfigModule.forRoot(), SqsModule, SqsConsumerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
