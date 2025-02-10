import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Config } from 'src/config';
import { EmailClient } from 'src/infra/email/emailClient';
import { InjectionTokens } from 'src/libs/common/constants';
import { handleErrorCatch } from 'src/libs/common/helpers/utils';
import { User } from 'src/modules/auth/entity/user.entity';

@Injectable()
export class EmailService {
  constructor(
    @Inject(InjectionTokens.EMAIL_CLIENT)
    private readonly emailClient: EmailClient,
  ) {}

  async sendAccountCreationEmail({
    otp,
    email,
  }: {
    otp: string;
    email: string;
  }) {
    const htmlContent = `
       <!DOCTYPE html>
       <html>
         <head>
           <meta charset="utf-8">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Welcome to Yadsale</title>
           <style>
             body {
               font-family: Arial, sans-serif;
               line-height: 1.6;
               color: #333333;
               max-width: 600px;
               margin: 0 auto;
             }
             .container {
               padding: 20px;
             }
             .header {
               text-align: center;
               margin-bottom: 30px;
             }
             .welcome-message {
               margin-bottom: 25px;
             }
             .credentials-box {
               background-color: #f8f9fa;
               border: 1px solid #e9ecef;
               border-radius: 8px;
               padding: 20px;
               margin: 20px 0;
             }
             .otp-container {
               background-color: #fff;
               border: 1px dashed #dee2e6;
               padding: 15px;
               margin: 10px 0;
               text-align: center;
               font-family: monospace;
               font-size: 24px;
               letter-spacing: 5px;
               font-weight: bold;
             }
             .warning-text {
               color: #dc3545;
               font-size: 14px;
               margin-top: 10px;
             }
             .cta-button {
               display: inline-block;
               background-color: #007bff;
               color: white;
               padding: 12px 24px;
               text-decoration: none;
               border-radius: 4px;
               margin-top: 20px;
             }
             .button-container {
               text-align: center;
               margin: 30px 0;
             }
             .cta-button:hover {
               background-color: #0056b3;
             }
             .security-notice {
               background-color: #fff3cd;
               border: 1px solid #ffeeba;
               color: #856404;
               padding: 15px;
               border-radius: 4px;
               margin: 20px 0;
               font-size: 14px;
             }
             .steps {
               margin: 20px 0;
             }
             .step {
               margin: 10px 0;
             }
             .step-number {
               display: inline-block;
               background-color: #007bff;
               color: white;
               width: 24px;
               height: 24px;
               text-align: center;
               border-radius: 50%;
               margin-right: 10px;
             }
             .footer {
               margin-top: 30px;
               text-align: center;
               color: #666666;
               font-size: 14px;
             }
           </style>
         </head>
         <body>
           <div class="container">
             <div class="header">
               <h1>Welcome to Yadsale!</h1>
             </div>
             
             <div class="welcome-message">
               <p>Hello,</p>
               <p>Your Yadsale account has been created successfully. Below is your One-Time Password (OTP) to complete your account setup.</p>
             </div>
             
             <div class="credentials-box">
               <h3>Your Account Verification</h3>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>One-Time Password (OTP):</strong></p>
               <div class="otp-container">
                 ${otp}
               </div>
               <p class="warning-text">This OTP is valid for a limited time. Please use it immediately.</p>
             </div>
             
             <div class="security-notice">
               <strong>🔒 Security Notice:</strong>
               <p>Never share your OTP with anyone. This code is for your account verification only.</p>
             </div>
             
             <div class="steps">
               <h3>Next Steps:</h3>
               <div class="step">
                 <span class="step-number">1</span>
                 Go to the account verification page
               </div>
               <div class="step">
                 <span class="step-number">2</span>
                 Enter your email address
               </div>
               <div class="step">
                 <span class="step-number">3</span>
                 Enter the OTP code provided above
               </div>
             </div>
 
             <div class="footer">
               <p>If you didn't request this account, please contact our support team immediately.</p>
               <p>Thank you for choosing Yadsale!</p>
             </div>
           </div>
         </body>
       </html>
     `;

    const textContent = `
    Welcome to Yadsale!

    Hello,

    Your Yadsale account has been created successfully. Below is your One-Time Password (OTP) to complete your account setup.

    Your Account Verification

    Email: ${email}

    One-Time Password (OTP):
    ${otp}

    IMPORTANT: This OTP is valid for a limited time. Please use it immediately.

    Security Notice:
    - Never share your OTP with anyone. This code is for your account verification only.

    Next Steps:
    1. Go to the account verification page
    2. Enter your email address
    3. Enter the OTP code provided above

    If you didn't request this account, please contact our support team immediately.

    Thank you for choosing Yadsale!
     `;

    const mailOptions = {
      to: email,
      subject: 'Welcome to Yadsale - Account Verification',
      text: textContent,
      html: htmlContent,
    };

    console.log('Sending account creation email to:', email);

    try {
      return await this.emailClient.send(mailOptions);
    } catch (error) {
      console.error('Error sending account creation email:', error);
      handleErrorCatch(error);
    }
  }

  async sendPasswordResetEmail({
    token,
    email,
  }: {
    token: string;
    email: string;
  }) {
    const resetLink = `${Config.FRONTEND_URL}/forgot-password/reset-password?token=${token}`;

    const textContent = `
  You have requested a password reset for your Yadsale account.
  
  Please click the following link to reset your password:
  ${resetLink}
  
  If you did not request a password reset, please ignore this email or contact support if you have concerns.
  
  This link will expire in 1 hour.
  
  Best regards,
  Yadsale Support Team
    `;

    const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Password Reset Request</h2>
      <p>You have requested a password reset for your Yadsale account.</p>
      <p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
      <p><small>This link will expire in 1 hour.</small></p>
      <p>Best regards,<br>Yadsale Support Team</p>
    </div>
  </body>
  </html>
    `;
  }

  async sendOfferNotificationEmail({
    user,
    price,
  }: {
    user: User;
    price: number;
  }) {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Offer Notification</title>
      </head>
      <body style="margin: 0; padding: 20px; background-color: #f6f9fc; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; font-size: 24px; margin: 0;">New Offer Received</h1>
          </div>
    
          <p style="color: #4a4a4a; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
            Hello ${user.username || user.email},
          </p>
    
          <p style="color: #4a4a4a; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
            You have received a new offer of <strong style="color: #2b52f5;">$${price.toLocaleString()}</strong> for your listing.
          </p>
    
          <p style="color: #4a4a4a; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
            Please log in to your account to review the details and respond to this offer.
          </p>
    
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${
              Config.FRONTEND_URL
            }/dashboard" style="background-color: #2b52f5; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
              View Offer
            </a>
          </div>
    
          <p style="color: #4a4a4a; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
            If you didn't expect to receive this notification, please ignore this email or contact our support team.
          </p>
    
          <hr style="border: none; border-top: 1px solid #e1e1e1; margin: 30px 0;">
    
          <p style="color: #898989; font-size: 14px; line-height: 21px; margin: 0;">
            Best regards,<br>
            The YadSale Team
          </p>
        </div>
      </body>
    </html>
    `;

    const textContent = `
    New Offer Received
    
    Hello ${user.username || user.email},
    
    You have received a new offer of $${price.toLocaleString()} for your listing.
    
    Please log in to your account to review the details and respond to this offer:
    ${Config.FRONTEND_URL}/dashboard
    
    If you didn't expect to receive this notification, please ignore this email or contact our support team.
    
    Best regards,
    The YadSale Team
    `;

    const mailOptions = {
      to: user.email,
      subject: 'New Offer Received - YadSale',
      text: textContent,
      html: htmlContent,
    };

    try {
      return await this.emailClient.send(mailOptions);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      handleErrorCatch(error);
    }
  }

  async sendCounterOfferNotificationEmail({
    user,
    originalPrice,
    counterPrice,
    itemName,
  }: {
    user: User;
    originalPrice: number;
    counterPrice: number;
    itemName: string;
  }) {
    const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Counter Offer Notification</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f6f9fc; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin: 0;">Counter Offer Received</h1>
        </div>
  
        <p style="color: #4a4a4a; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
          Hello ${user.username || user.email},
        </p>
  
        <p style="color: #4a4a4a; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
          The seller has countered your offer of <strong style="color: #2b52f5;">$${originalPrice.toLocaleString()}</strong> 
          for ${itemName} with a new price of <strong style="color: #2b52f5;">$${counterPrice.toLocaleString()}</strong>.
        </p>
  
        <p style="color: #4a4a4a; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
          Please log in to your account to review and respond to this counter offer.
        </p>
  
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${
            Config.FRONTEND_URL
          }/dashboard" style="background-color: #2b52f5; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            View Counter Offer
          </a>
        </div>
  
        <p style="color: #4a4a4a; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
          If you didn't expect to receive this notification, please ignore this email or contact our support team.
        </p>
  
        <hr style="border: none; border-top: 1px solid #e1e1e1; margin: 30px 0;">
  
        <p style="color: #898989; font-size: 14px; line-height: 21px; margin: 0;">
          Best regards,<br>
          The YadSale Team
        </p>
      </div>
    </body>
  </html>
  `;

    const textContent = `
  Counter Offer Received

  Hello ${user.username || user.email},

  The seller has countered your offer of $${originalPrice.toLocaleString()} for ${itemName} with a new price of $${counterPrice.toLocaleString()}.

  Please log in to your account to review and respond to this counter offer:
  ${Config.FRONTEND_URL}/dashboard

  If you didn't expect to receive this notification, please ignore this email or contact our support team.

  Best regards,
  The YadSale Team
  `;

    const mailOptions = {
      to: user.email,
      subject: 'Counter Offer Received - YadSale',
      text: textContent,
      html: htmlContent,
    };

    try {
      return await this.emailClient.send(mailOptions);
    } catch (error) {
      console.error('Error sending counter offer notification email:', error);
      handleErrorCatch(error);
    }
  }

  // async sendForgotPasswordEmail({
  //   email,
  //   otp,
  //   otpExpiryMinutes = 10
  // }: {
  //   email: string;
  //   otp: string;
  //   otpExpiryMinutes?: number;
  // }) {
  //   const htmlContent = `
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <meta charset="utf-8">
  //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //         <title>Password Reset OTP - Yadsale</title>
  //         <style>
  //           body {
  //             font-family: Arial, sans-serif;
  //             line-height: 1.6;
  //             color: #333333;
  //             max-width: 600px;
  //             margin: 0 auto;
  //           }
  //           .container {
  //             padding: 20px;
  //           }
  //           .header {
  //             text-align: center;
  //             margin-bottom: 30px;
  //           }
  //           .otp-box {
  //             background-color: #f8f9fa;
  //             border: 1px solid #e9ecef;
  //             border-radius: 8px;
  //             padding: 20px;
  //             margin: 20px 0;
  //             text-align: center;
  //           }
  //           .otp-code {
  //             font-family: monospace;
  //             font-size: 32px;
  //             letter-spacing: 4px;
  //             color: #007bff;
  //             background-color: #fff;
  //             padding: 15px;
  //             border: 1px dashed #dee2e6;
  //             border-radius: 4px;
  //             margin: 15px 0;
  //           }
  //           .expiry-notice {
  //             color: #dc3545;
  //             font-size: 14px;
  //             margin-top: 10px;
  //           }
  //           .security-notice {
  //             background-color: #fff3cd;
  //             border: 1px solid #ffeeba;
  //             color: #856404;
  //             padding: 15px;
  //             border-radius: 4px;
  //             margin: 20px 0;
  //             font-size: 14px;
  //           }
  //           .steps {
  //             margin: 20px 0;
  //           }
  //           .step {
  //             margin: 10px 0;
  //           }
  //           .step-number {
  //             display: inline-block;
  //             background-color: #007bff;
  //             color: white;
  //             width: 24px;
  //             height: 24px;
  //             text-align: center;
  //             border-radius: 50%;
  //             margin-right: 10px;
  //           }
  //           .warning-box {
  //             background-color: #f8d7da;
  //             border: 1px solid #f5c6cb;
  //             color: #721c24;
  //             padding: 15px;
  //             border-radius: 4px;
  //             margin: 20px 0;
  //             font-size: 14px;
  //           }
  //           .footer {
  //             margin-top: 30px;
  //             text-align: center;
  //             color: #666666;
  //             font-size: 14px;
  //             border-top: 1px solid #eee;
  //             padding-top: 20px;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="container">
  //           <div class="header">
  //             <h1>Password Reset Request</h1>
  //           </div>

  //           <p>Hello,</p>

  //           <p>We received a request to reset the password for your Cleggs Suggicare account. Use the following OTP code to complete your password reset:</p>

  //           <div class="otp-box">
  //             <strong>Your Password Reset OTP:</strong>
  //             <div class="otp-code">
  //               ${otp}
  //             </div>
  //             <p class="expiry-notice">
  //               This OTP will expire in ${otpExpiryMinutes} minutes
  //             </p>
  //           </div>

  //           <div class="steps">
  //             <h3>Next Steps:</h3>
  //             <div class="step">
  //               <span class="step-number">1</span>
  //               Enter this OTP code in the password reset page
  //             </div>
  //             <div class="step">
  //               <span class="step-number">2</span>
  //               Create your new password
  //             </div>
  //             <div class="step">
  //               <span class="step-number">3</span>
  //               Use your new password to log in
  //             </div>
  //           </div>

  //           <div class="security-notice">
  //             <strong>🔒 Security Notice:</strong>
  //             <p>This OTP is valid for ${otpExpiryMinutes} minutes only. For security reasons, do not share this OTP with anyone, including Cleggs Suggicare staff.</p>
  //           </div>

  //           <div class="warning-box">
  //             <strong>⚠️ Important:</strong>
  //             <p>If you didn't request this password reset, please ignore this email or contact our support team immediately if you believe your account has been compromised.</p>
  //           </div>

  //           <div class="footer">
  //             <p>This is an automated message, please do not reply to this email.</p>
  //             <p>Thank you for using Cleggs Suggicare!</p>
  //           </div>
  //         </div>
  //       </body>
  //     </html>
  //   `;

  //   const textContent = `
  // Password Reset Request - Cleggs Suggicare

  // Hello,

  // We received a request to reset the password for your Cleggs Suggicare account.

  // Your Password Reset OTP: ${otp}

  // IMPORTANT: This OTP will expire in ${otpExpiryMinutes} minutes.

  // Next Steps:
  // 1. Enter this OTP code in the password reset page
  // 2. Create your new password
  // 3. Use your new password to log in

  // Security Notice:
  // - This OTP is valid for ${otpExpiryMinutes} minutes only
  // - Do not share this OTP with anyone, including Cleggs Suggicare staff
  // - If you didn't request this password reset, please ignore this email or contact our support team immediately

  // This is an automated message, please do not reply to this email.

  // Thank you for using Cleggs Suggicare!
  //   `;

  //   const mailOptions = {
  //     to: email,
  //     subject: 'Password Reset OTP - Cleggs Suggicare',
  //     text: textContent,
  //     html: htmlContent
  //   };

  //   try {
  //     this.emailClient.send(mailOptions);
  //     console.log(`Password reset OTP email sent successfully to ${email}`);
  //   } catch (error) {
  //     console.error('Error sending password reset OTP email:', error);
  //     throw error;
  //   }
  // }

  // async sendContactUsEmail({
  //   name,
  //   email,
  //   phone,
  //   heardAbout,
  //   message
  // }: ContactUsDto) {
  //   const emailSubject = `New Contact Form Submission from ${name}`;

  //   const emailBody = `
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <style>
  //           body {
  //             font-family: Arial, sans-serif;
  //             line-height: 1.6;
  //             color: #333333;
  //           }
  //           .container {
  //             max-width: 600px;
  //             margin: 0 auto;
  //             padding: 20px;
  //           }
  //           .header {
  //             background-color: #f8f9fa;
  //             padding: 15px;
  //             border-radius: 5px;
  //             margin-bottom: 20px;
  //           }
  //           .content {
  //             background-color: #ffffff;
  //             padding: 20px;
  //             border-radius: 5px;
  //             border: 1px solid #dee2e6;
  //           }
  //           .field {
  //             margin-bottom: 15px;
  //           }
  //           .field-label {
  //             font-weight: bold;
  //             color: #495057;
  //           }
  //           .message-box {
  //             background-color: #f8f9fa;
  //             padding: 15px;
  //             border-radius: 5px;
  //             margin-top: 20px;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="container">
  //           <div class="header">
  //             <h2>New Contact Form Submission</h2>
  //           </div>

  //           <div class="content">
  //             <div class="field">
  //               <p class="field-label">Name:</p>
  //               <p>${name}</p>
  //             </div>

  //             <div class="field">
  //               <p class="field-label">Email:</p>
  //               <p>${email}</p>
  //             </div>

  //             <div class="field">
  //               <p class="field-label">Phone:</p>
  //               <p>${phone || 'Not provided'}</p>
  //             </div>

  //             <div class="field">
  //               <p class="field-label">How did they hear about us?</p>
  //               <p>${heardAbout || 'Not specified'}</p>
  //             </div>

  //             <div class="message-box">
  //               <p class="field-label">Message:</p>
  //               <p>${message}</p>
  //             </div>
  //           </div>
  //         </div>
  //       </body>
  //     </html>
  //   `;

  //   const mailOptions = {
  //     to: Config.ADMIN_EMAIL,
  //     subject: emailSubject,
  //     html: emailBody
  //   };

  //   try {
  //     return this.emailClient.send(mailOptions);
  //   } catch (error) {
  //     console.error('Error sending contact us email:', error);
  //     throw new BadRequestException('Error sending contact us email');
  //   }
  // }
}
