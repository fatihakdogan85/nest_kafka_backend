import { KafkaOptions, Transport } from '@nestjs/microservices';
import { KAFKA_BROKER, KAFKA_EMAIL_GROUP_ID } from './utils/constants';

export const microserviceConfig: KafkaOptions = {
  transport: Transport.KAFKA,

  options: {
    client: {
      brokers: [KAFKA_BROKER],
    },
    consumer: {
      groupId: KAFKA_EMAIL_GROUP_ID,
      allowAutoTopicCreation: true,
    },
  },
};
