import { Post, Body, Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/signup.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { FirebaseAuthService } from 'src/infra/auth/firebase-auth.service';
import { GoogleAuthDto } from '../dto/google-auth.dto';
import { handleErrorCatch } from 'src/libs/common/helpers/utils';
import { EmailValidationDto } from '../dto/email-validation.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly firebaseAuthService: FirebaseAuthService,
  ) {}

  @Post('signup')
  async createUser(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('resend-otp')
  async resendOtp(@Body() { email }: EmailValidationDto) {
    return await this.authService.resendOtp(email);
  }

  @Post('login')
  async login(@Body() loginRequestDto: LoginRequestDto) {
    return await this.authService.login(loginRequestDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return await this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Post('google')
  async authenticateWithGoogle(@Body() googleAuthDto: GoogleAuthDto) {
    const { idToken } = googleAuthDto;

    try {
      const { token, user } =
        await this.authService.authenticateWithGoogle(idToken);

      return {
        message: 'Authentication successful',
        token,
        user,
      };
    } catch (error) {
      handleErrorCatch(error);
    }
  }
}
