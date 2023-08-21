import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailBatchRequestDto {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  requestCount?: number;

  @Column('date')
  createdAt?: Date;
}
