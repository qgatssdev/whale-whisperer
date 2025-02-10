import { EmailClient } from './emailClient';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Config } from 'src/config';
import { handleErrorCatch } from 'src/libs/common/helpers/utils';

@Injectable()
export class NodeMailer implements EmailClient {
  private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private logger: Logger;

  constructor(private readonly configService: ConfigService) {
    this.logger = new Logger(NodeMailer.name);
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async send(data: Mail.Options) {
    try {
      const mailOptions = {
        from: Config.EMAIL_USER,
        ...data,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log('Email sent successfully!');
      return info;
    } catch (error) {
      handleErrorCatch(error);
    }
  }
}
