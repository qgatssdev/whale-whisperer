import { Module } from '@nestjs/common';
import { NodeMailer } from 'src/infra/email/node-mailer';
import { InjectionTokens } from 'src/libs/common/constants';
import { EmailService } from './services/email.service';
import { UserRepository } from 'src/modules/auth/repository/user.repository';

const infrastructure = [
  {
    provide: InjectionTokens.EMAIL_CLIENT,
    useClass: NodeMailer,
  },
];

@Module({
  controllers: [],
  providers: [...infrastructure, EmailService, UserRepository],
  exports: [...infrastructure, EmailService, UserRepository],
})
export class SharedModule {}
