import { Module } from '@nestjs/common';
import { SqsConsumerService } from './sqs-consumer.service';
import { ConfigModule } from '@nestjs/config';
import { AwsConfigService } from 'aws.config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [AwsConfigService, SqsConsumerService],
  exports: [SqsConsumerService],
})
export class SqsConsumerModule { }
