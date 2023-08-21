import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EmailBatchRequestDto } from './emailBatchRequest.dto';

@Entity()
export class EmailLogDto {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  recipient: string;

  @Column()
  content: string;

  @Column()
  subject: string;

  @Column('date')
  createdAt: Date;

  @ManyToOne(() => EmailBatchRequestDto)
  @JoinColumn([{ name: 'requestId', referencedColumnName: 'id' }])
  request: EmailBatchRequestDto;
}
