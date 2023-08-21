import { Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { EmailModule } from './email.module';
import * as ormConfig from '../../ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
