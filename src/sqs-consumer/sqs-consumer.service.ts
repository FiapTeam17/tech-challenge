// sqs-consumer.service.ts

import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AwsConfigService } from 'aws.config';

@Injectable()
export class SqsConsumerService {
    constructor(private readonly awsConfigService: AwsConfigService) { }

    async consumeMessages(queueUrl: string): Promise<void> {
        const sqs = this.awsConfigService.getAWSInstance();
        const params = {
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 10, // Defina o número máximo de mensagens a serem recebidas de uma vez
            WaitTimeSeconds: 20, // Defina o tempo de espera para receber mensagens da fila
        };

        while (true) {
            try {
                const data = await sqs.receiveMessage(params).promise(); // Receba mensagens da fila
                if (data.Messages) {
                    for (const message of data.Messages) {
                        console.log('Received message:', message.Body);
                        // Adicione seu processamento de mensagem aqui
                        await this.deleteMessage(queueUrl, message.ReceiptHandle); // Exclua a mensagem após processá-la
                    }
                }
            } catch (error) {
                console.error('Error receiving message:', error);
            }
        }
    }

    async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
        const sqs = new AWS.SQS();
        const params = {
            QueueUrl: queueUrl,
            ReceiptHandle: receiptHandle,
        };
        await sqs.deleteMessage(params).promise(); // Exclua a mensagem da fila
    }
}
