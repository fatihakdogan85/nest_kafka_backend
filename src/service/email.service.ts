import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EmailRequest } from '../model/email.request';
import { EmailSender } from '../utils/emailSender';
import { EmailBatchRequestDto } from '../entity/emailBatchRequest.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EmailLogDto } from '../entity/emailLog.dto';
import { EmailResponse } from '../model/email.response';
import {
  KAFKA_EMAIL_MICROSERVICE,
  KAFKA_EMAIL_TOPIC,
} from '../utils/constants';

@Injectable()
export class EmailService implements OnModuleInit {
  emailSender: EmailSender = new EmailSender();

  constructor(
    @Inject(KAFKA_EMAIL_MICROSERVICE)
    private readonly consumerClient: ClientKafka,
    @InjectRepository(EmailBatchRequestDto)
    private mailBatchRequestRepository: Repository<EmailBatchRequestDto>,
    @InjectRepository(EmailLogDto)
    private mailLogRepository: Repository<EmailLogDto>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async insertBatchRequest(
    batchRequestDto: EmailBatchRequestDto,
  ): Promise<number> {
    //Insert the batch request to DB
    const response = (
      await this.mailBatchRequestRepository.insert(batchRequestDto)
    ).generatedMaps[0]?.id;
    return response;
  }

  async insertMailLog(emailLogDto: EmailLogDto): Promise<number> {
    //Insert mail sending log to DB
    const response = (await this.mailLogRepository.insert(emailLogDto))
      .generatedMaps[0]?.id;
    return response;
  }

  async getBatchRequests(): Promise<EmailResponse[]> {
    //Get requests with target count and processed count
    const results: EmailResponse[] = await this.dataSource.query(
      `select log.requestId, req.requestCount, count(*) as processedRequestCount
        FROM email_log_dto log
        LEFT JOIN email_batch_request_dto req  ON (log.requestId = req.id)
        group by log.requestId;`,
    );

    return results;
  }

  async sendBatchEmailRequest(requestCount: number): Promise<number> {
    //Save the mail request to DB
    const batchRequestDto: EmailBatchRequestDto = {
      createdAt: new Date(),
      requestCount: requestCount,
    };
    const batchRequestId: number =
      await this.insertBatchRequest(batchRequestDto);
    if (batchRequestId <= 0) {
      throw new InternalServerErrorException(
        'Error saving batch request to DB!',
      );
    }

    //Send the tasks to queue with the DB Id
    for (let emailIndex = 0; emailIndex < requestCount; emailIndex++) {
      const request: EmailRequest = {
        requestId: batchRequestId,
        emailAddress: `address_${emailIndex}@gmail.com`,
        subject: 'Subject for the email',
        content: 'Content for the email',
      };

      this.consumerClient.emit(KAFKA_EMAIL_TOPIC, JSON.stringify(request));
    }

    return batchRequestId;
  }

  async sendEmail(emailRequest: EmailRequest) {
    //Ignore mail sending for interview purpose
    const mailResponse: boolean = true; //this.emailSender.sendMail(emailRequest);
    if (mailResponse) {
      //Save the mail log to DB
      const mailLogDto: EmailLogDto = {
        createdAt: new Date(),
        recipient: emailRequest.emailAddress,
        subject: emailRequest.subject,
        content: emailRequest.content,
        request: { id: emailRequest.requestId },
      };

      this.insertMailLog(mailLogDto);
    }
  }

  async onModuleInit() {
    //Subscribe to the topic
    this.consumerClient.subscribeToResponseOf(KAFKA_EMAIL_TOPIC);
  }
}
