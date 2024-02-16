import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SqsService } from './sqs/sqs.service';
import { SqsConsumerService } from './sqs-consumer/sqs-consumer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sqsService: SqsService,
    private readonly sqsConsumerService: SqsConsumerService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async sendMessage(@Body('message') message: string): Promise<string> {
    const queueUrl = 'https://sqs.us-east-1.amazonaws.com/637423294426/poc'; // substitua pelo URL da sua fila SQS
    await this.sqsService.sendMessage(queueUrl, "teste");
    return 'Message sent to SQS';
  }

  @Get('consume-messages')
  async consumeMessages(): Promise<void> {
    const queueUrl = 'https://sqs.us-east-1.amazonaws.com/637423294426/poc'; // Substitua pelo URL da sua fila SQS
    await this.sqsConsumerService.consumeMessages(queueUrl);
  }
}
