import { Injectable } from '@nestjs/common';
import { AwsConfigService } from '../../aws.config';

@Injectable()
export class SqsService {
    constructor(private readonly awsConfigService: AwsConfigService) { }

    async sendMessage(queueUrl: string, messageBody: string): Promise<void> {
        const sqs = this.awsConfigService.getAWSInstance();
        const params = {
            MessageBody: messageBody,
            QueueUrl: queueUrl,
        };

        await sqs.sendMessage(params).promise();
    }
}