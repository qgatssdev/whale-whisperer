import { BaseEntity } from 'src/libs/core/base/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({ unique: true, type: 'varchar', nullable: true })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  signUpOtp: string;

  @Column({ nullable: true })
  signUpOtpExpires: Date;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;
}
