import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsConfigService {
    constructor(private readonly configService: ConfigService) { }

    getAWSInstance(): AWS.SQS {
        AWS.config.update({
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            region: this.configService.get('AWS_REGION'),
            sessionToken: this.configService.get('AWS_SESSION_TOKEN'),
        });

        return new AWS.SQS();
    }
}