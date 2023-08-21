import { Module } from '@nestjs/common';
import { EmailController } from '../controller/email.controller';
import { EmailService } from '../service/email.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailBatchRequestDto } from '../entity/emailBatchRequest.dto';
import { EmailLogDto } from '../entity/emailLog.dto';
import {
  KAFKA_BROKER,
  KAFKA_EMAIL_CLIENT,
  KAFKA_EMAIL_GROUP_ID,
  KAFKA_EMAIL_MICROSERVICE,
} from '../utils/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KAFKA_EMAIL_MICROSERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: KAFKA_EMAIL_CLIENT,
            brokers: [KAFKA_BROKER],
          },
          producerOnlyMode: true,
          consumer: {
            groupId: KAFKA_EMAIL_GROUP_ID,
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([EmailBatchRequestDto]),
    TypeOrmModule.forFeature([EmailLogDto]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
