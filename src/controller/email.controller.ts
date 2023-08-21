import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { EmailService } from '../service/email.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailRequest } from '../model/email.request';
import { KAFKA_EMAIL_TOPIC } from '../utils/constants';

@Controller('/v1/emails')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Get()
  getEmailRequests(): any {
    //Return the request list with target and processed counts
    return this.emailService.getBatchRequests();
  }

  @Post()
  async sendEmailRequest(@Res() response, @Body() mailRequest: any) {
    const { requestCount } = mailRequest;

    if (!requestCount || requestCount <= 0) {
      throw new BadRequestException('Invalid parameters.');
    }

    //Send the batch request to service
    const batchRequestId: any =
      await this.emailService.sendBatchEmailRequest(requestCount);

    //Return the created entity ID
    response.send({
      requestId: batchRequestId,
    });
  }

  @MessagePattern(KAFKA_EMAIL_TOPIC)
  async handleSendEmail(@Payload(ValidationPipe) emailRequest: EmailRequest) {
    //Kafka consumer event handler
    return this.emailService.sendEmail(emailRequest);
  }
}
