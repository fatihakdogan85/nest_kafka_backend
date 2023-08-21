import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { microserviceConfig } from './microserviceConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.connectMicroservice(microserviceConfig);

  app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
