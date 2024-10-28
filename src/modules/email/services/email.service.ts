// src/modules/email/services/email.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailConfig, EmailTemplateData } from '../templates';
import { EmailTemplate, UserRole } from 'src/common/enums/app.enum';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('email.host'),
      port: this.configService.get('email.port'),
      secure: true,
      auth: {
        user: this.configService.get('email.user'),
        pass: this.configService.get('email.password'),
      },
    });
  }

  private getEmailTemplate(
    template: EmailTemplate,
    data: EmailTemplateData,
  ): EmailConfig {
    const templates = {
      [EmailTemplate.EMPLOYEE_WELCOME]: {
        subject: `Welcome to ${data.companyName} on Shopeazz!`,
        template: this.getEmployeeWelcomeTemplate(data),
      },
      [EmailTemplate.SELLER_WELCOME]: {
        subject: 'Welcome to Shopeazz Seller Platform!',
        template: this.getSellerWelcomeTemplate(data),
      },
      [EmailTemplate.SELLER_VERIFICATION]: {
        subject: 'Your Shopeazz Seller Account is Pending Verification',
        template: this.getSellerVerificationTemplate(data),
      },
      [EmailTemplate.PASSWORD_RESET]: {
        subject: 'Reset Your Shopeazz Password',
        template: this.getPasswordResetTemplate(data),
      },
      [EmailTemplate.EMAIL_VERIFICATION]: {
        subject: 'Verify Your Shopeazz Email Address',
        template: this.getEmailVerificationTemplate(data),
      },
      [EmailTemplate.ACCOUNT_DEACTIVATED]: {
        subject: 'Shopeazz Account Deactivated',
        template: this.getAccountDeactivatedTemplate(data),
      },
    };

    return templates[template];
  }

  private getEmployeeWelcomeTemplate(data: EmailTemplateData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .container { 
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #10B981;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
              line-height: 1.6;
            }
            .button {
              background-color: #10B981;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Shopeazz!</h1>
            </div>
            <div class="content">
              <p>Hello ${data.firstName},</p>
              <p>Welcome to ${data.companyName}'s corporate shopping platform on Shopeazz! Your account has been successfully created.</p>
              
              <h2>Your Account Details:</h2>
              <ul>
                <li>Email: ${data.email}</li>
                <li>Employee ID: ${data.employeeId}</li>
              </ul>

              <h2>Getting Started:</h2>
              <ul>
                <li>Browse available products</li>
                <li>Use salary deduction or direct payment</li>
                <li>Track your orders</li>
                <li>Manage your profile</li>
              </ul>

              <p>To get started, please verify your email address by clicking the button below:</p>
              
              <a href="${data.verificationLink}" class="button">Verify Email</a>

              <p>If you have any questions, our support team is here to help!</p>

              <p>Best regards,<br>The Shopeazz Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getSellerWelcomeTemplate(data: EmailTemplateData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            /* Similar styling as above */
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Shopeazz Seller Platform!</h1>
            </div>
            <div class="content">
              <p>Hello ${data.firstName},</p>
              <p>Thank you for choosing to sell on Shopeazz! Your seller account is currently under review.</p>
              
              <h2>Next Steps:</h2>
              <ul>
                <li>Our team will verify your seller information</li>
                <li>You'll receive a verification email within 24-48 hours</li>
                <li>Once verified, you can start listing your products</li>
              </ul>

              <p>While you wait, you can prepare:</p>
              <ul>
                <li>Product images and descriptions</li>
                <li>Pricing strategy</li>
                <li>Shipping details</li>
              </ul>

              <p>Best regards,<br>The Shopeazz Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getPasswordResetTemplate(data: EmailTemplateData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            /* Similar styling as above */
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <p>Hello ${data.firstName},</p>
              <p>We received a request to reset your password. Click the button below to proceed:</p>
              
              <a href="${data.resetLink}" class="button">Reset Password</a>

              <p>If you didn't request this, you can safely ignore this email.</p>
              
              <p>Best regards,<br>The Shopeazz Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
  private getSellerVerificationTemplate(data: EmailTemplateData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .container { 
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #10B981;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
              line-height: 1.6;
            }
            .button {
              background-color: #10B981;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
              margin-top: 15px;
            }
            .status-pending {
              color: #F59E0B;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Seller Account Verification</h1>
            </div>
            <div class="content">
              <p>Hello ${data.firstName},</p>
              
              <p>Your seller account application is currently <span class="status-pending">under review</span>.</p>

              <h2>Verification Status:</h2>
              <ul>
                <li>Business Name: ${data.businessName}</li>
                <li>Application Date: ${new Date(data.applicationDate).toLocaleDateString()}</li>
                <li>Status: Pending Review</li>
              </ul>

              <h2>Next Steps:</h2>
              <ul>
                <li>Our team will verify your submitted information</li>
                <li>We may contact you for additional documentation if needed</li>
                <li>You'll receive a notification once the verification is complete</li>
              </ul>

              <p>Expected verification time: 24-48 business hours</p>

              <p>If you have any questions, please contact our seller support team.</p>

              <p>Best regards,<br>The Shopeazz Seller Support Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getEmailVerificationTemplate(data: EmailTemplateData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .container { 
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #10B981;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
              line-height: 1.6;
            }
            .button {
              background-color: #10B981;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
              margin-top: 15px;
            }
            .verification-code {
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 2px;
              color: #10B981;
              text-align: center;
              padding: 20px;
              background-color: #F3F4F6;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email Address</h1>
            </div>
            <div class="content">
              <p>Hello ${data.firstName},</p>
              
              <p>Thank you for creating an account with Shopeazz. To complete your registration, please verify your email address.</p>

              <p>Click the button below to verify your email:</p>
              
              <a href="${data.verificationLink}" class="button">Verify Email</a>

              <p>Or enter this verification code if prompted:</p>
              
              <div class="verification-code">
                ${data.verificationCode}
              </div>

              <p>This verification link and code will expire in 24 hours.</p>

              <p>If you didn't create an account with Shopeazz, you can safely ignore this email.</p>

              <p>Best regards,<br>The Shopeazz Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getAccountDeactivatedTemplate(data: EmailTemplateData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .container { 
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #EF4444;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
              line-height: 1.6;
            }
            .warning {
              color: #EF4444;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Account Deactivated</h1>
            </div>
            <div class="content">
              <p>Hello ${data.firstName},</p>
              
              <p class="warning">Your Shopeazz account has been deactivated.</p>

              <h2>Deactivation Details:</h2>
              <ul>
                <li>Date: ${new Date(data.deactivationDate).toLocaleDateString()}</li>
                <li>Reason: ${data.reason}</li>
              </ul>

              <p>If you believe this is a mistake or would like to reactivate your account, please contact our support team.</p>

              <p>Best regards,<br>The Shopeazz Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  async sendEmail(
    to: string,
    template: EmailTemplate,
    data: EmailTemplateData,
  ): Promise<void> {
    const emailConfig = this.getEmailTemplate(template, data);

    await this.transporter.sendMail({
      from: this.configService.get('email.from'),
      to,
      subject: emailConfig.subject,
      html: emailConfig.template,
    });
  }

  async sendRegistrationEmail(user: any, company?: any): Promise<void> {
    const baseData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      verificationLink: `${this.configService.get('app.url')}/verify-email?token=${user.emailVerificationToken}`,
    };

    switch (user.role) {
      case UserRole.EMPLOYEE:
        await this.sendEmail(user.email, EmailTemplate.EMPLOYEE_WELCOME, {
          ...baseData,
          companyName: company.name,
          employeeId: user.employeeId,
        });
        break;

      case UserRole.SELLER:
        await this.sendEmail(
          user.email,
          EmailTemplate.SELLER_WELCOME,
          baseData,
        );
        break;
    }
  }
}
