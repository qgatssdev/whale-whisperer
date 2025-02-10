import { BaseEntity } from 'src/libs/core/base/BaseEntity';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Whale extends BaseEntity {
  @PrimaryColumn()
  walletAddress: string;

  @Column({ type: 'numeric', precision: 36, scale: 18 })
  balance: number;

  @Column()
  transactionCount: number;
}
