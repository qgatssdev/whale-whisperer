import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { SignUpDto } from '../dto/signup.dto';
import { PasswordEncoder } from 'src/infra/password-encoder/password-encoder';
import { generateOTP, handleErrorCatch } from 'src/libs/common/helpers/utils';
import { User } from '../entity/user.entity';
import { Config } from 'src/config';
import * as jwt from 'jsonwebtoken';
import { LoginRequestDto } from '../dto/login-request.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { EmailService } from 'src/shared/services/email.service';

@Injectable()
export class AuthService {
  private logger: Logger;
  constructor() {
    this.logger = new Logger();
  }

  @Inject()
  private readonly userRepository: UserRepository;

  @Inject()
  private readonly emailService: EmailService;

  public async signUp({ email, password }: SignUpDto) {
    try {
      const userExists = await this.userRepository.findOne({
        where: { email },
      });
      if (userExists) {
        throw new BadRequestException('User already exists');
      }

      const hashedPassword = await PasswordEncoder.hash(password);

      const otp = generateOTP();

      const user = await this.userRepository.create({
        password: hashedPassword,
        email,
        signUpOtp: otp,
        signUpOtpExpires: new Date(Date.now() + 600000),
      });

      await this.emailService.sendAccountCreationEmail({
        email,
        otp,
      });

      await this.userRepository.save(user);

      return {
        message: 'User created successfully',
      };
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async verifyOtp(data: { email: string; otp: string }) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: data.email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.signUpOtp !== data.otp) {
        throw new BadRequestException('Invalid OTP');
      }

      if (user.signUpOtpExpires < new Date()) {
        throw new BadRequestException('OTP has expired');
      }

      await this.userRepository.findOneAndUpdate(
        { email: data.email },
        { emailVerified: true },
      );

      return {
        message: 'User verified successfully',
        token: this.signToken(user),
      };
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async resendOtp(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.emailVerified) {
        throw new BadRequestException('Email already verified');
      }

      const otp = generateOTP();

      await this.userRepository.findOneAndUpdate(
        { email },
        {
          signUpOtp: otp,
          signUpOtpExpires: new Date(Date.now() + 600000),
        },
      );

      await this.emailService.sendAccountCreationEmail({
        email,
        otp,
      });

      return {
        message: 'OTP sent successfully',
      };
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  private signToken(user: User) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      Config.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );
  }

  async login({ emailOrUsername, password }: LoginRequestDto) {
    try {
      const user = await this.userRepository.findOne({
        where: [
          { email: emailOrUsername, isActive: true },
          { username: emailOrUsername, isActive: true },
        ],
      });

      if (!user) {
        throw new BadRequestException('Invalid email or password');
      }

      const passwordMatch = await PasswordEncoder.compare(
        password,
        user.password,
      );

      if (!passwordMatch) {
        throw new BadRequestException('Invalid email or password');
      }

      const token = this.signToken(user);
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      };
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const token = jwt.sign(
        {
          id: user.id,
          type: 'reset-password',
        },
        Config.JWT_SECRET,
        {
          expiresIn: '1h',
        },
      );

      await this.emailService.sendPasswordResetEmail({
        token,
        email,
      });

      return {
        message: 'Password reset email sent',
      };
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async resetPassword({ token, password }: ResetPasswordDto) {
    try {
      const decoded = jwt.verify(token, Config.JWT_SECRET) as {
        id: string;
        type: string;
      };

      const user = await this.userRepository.findOne({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (decoded.type !== 'reset-password') {
        throw new BadRequestException('Invalid token');
      }

      const hashedPassword = await PasswordEncoder.hash(password);

      await this.userRepository.findOneAndUpdate(
        { id: decoded.id },
        { password: hashedPassword },
      );

      return {
        message: 'Password reset successfully',
      };
    } catch (error) {
      handleErrorCatch(error);
    }
  }
}
