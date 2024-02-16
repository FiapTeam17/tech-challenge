import { Module } from '@nestjs/common';
import { AwsConfigService } from '../../aws.config';
import { SqsService } from './sqs.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot()],
    providers: [AwsConfigService, SqsService],
    exports: [SqsService],
})
export class SqsModule { }