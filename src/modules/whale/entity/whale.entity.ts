import { IsIn, Max, Min } from 'class-validator';
import { BaseEntity } from 'src/libs/core/base/BaseEntity';
import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Whale extends BaseEntity {
  @PrimaryColumn()
  walletAddress: string;

  @Column({ type: 'numeric', precision: 36, scale: 18 })
  balance: number;

  @Column()
  transactionCount: number;

  @Column()
  label: string;

  @Column()
  @IsIn(['rule', 'ai', 'manual'])
  detectionSource: 'rule' | 'ai' | 'manual';

  @Column({ type: 'real', nullable: true })
  @Min(0)
  @Max(100)
  confidence: number;

  @Column({ nullable: true })
  tradingStyle: string;

  @Column({ nullable: true })
  strengths: string;

  @Column({ nullable: true })
  riskScore: number;

  @Column({ nullable: true })
  profitabilityScore: number;

  @CreateDateColumn()
  firstDetectedAt: Date;

  @Column({ default: false })
  isActive: boolean;
}
