// src/modules/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, AuthTokensDto } from './dto/auth-response.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenType, UserRole } from 'src/common/enums/app.enum';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { Company } from '../companies/entities/company.entity';
import * as nodemailer from "nodemailer";
import * as path from 'path';
import Handlebars from 'handlebars';
import * as fs from 'fs';




@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(
    loginDto: LoginDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateAuthTokens(user.id);
    await this.saveRefreshToken(
      user.id,
      tokens.refreshToken,
      ipAddress,
      userAgent,
    );

    // Update last login
    await this.usersRepository.update(user.id, { lastLoginAt: new Date() });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens,
    };
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });
  
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
  
    // Validate company association for employees
    let company: Company | null = null;
    if (registerDto.role === UserRole.EMPLOYEE) {
      if (!registerDto.companyId) {
        throw new BadRequestException(
          'Company ID is required for employee registration',
        );
      }
  
      company = await this.companiesRepository.findOne({
        where: { id: registerDto.companyId, isActive: true },
      });
  
      if (!company) {
        throw new NotFoundException('Company not found or inactive');
      }
  
      // Optional: Check if employeeId is unique within the company
      if (registerDto.employeeId) {
        const existingEmployee = await this.usersRepository.findOne({
          where: {
            employeeId: registerDto.employeeId,
            company: { id: registerDto.companyId },
          },
        });
  
        if (existingEmployee) {
          throw new ConflictException(
            'Employee ID already exists in this company',
          );
        }
      }
    } else {
      // Remove company-related fields for non-employee roles
      delete registerDto.companyId;
      delete registerDto.employeeId;
    }
  
    // Hash password
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      this.configService.get('security.bcryptSaltRounds'),
    );
  
    // Generate email verification token and expiration
    const emailVerificationToken = await this.generateToken(
      registerDto.email, // Use email or other identifier for token generation
      TokenType.ACCESS,
    );
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  
    // Create user with appropriate associations
    const user = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
      emailVerified: false,
      emailVerificationToken,
      emailVerificationExpires,
      company, // Will be null for non-employees
    });
  
    // Add role-specific initialization
    switch (registerDto.role) {
      case UserRole.EMPLOYEE:
        user.isActive = true; // Employees are active immediately
        break;
      case UserRole.SELLER:
        user.isActive = false; // Sellers need verification
        user.sellerProfile = {
          isVerified: false,
          status: 'PENDING',
          createdAt: new Date(),
        };
        break;
      case UserRole.ADMIN:
        throw new BadRequestException(
          'Admin registration is not allowed through this endpoint',
        );
    }
  
    // Save the user
    await this.usersRepository.save(user);
  
    // Prepare response
    const response: RegisterResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      message: this.getRegistrationMessage(user.role),
    };
  
    // Add company info for employees
    if (company) {
      response.company = {
        id: company.id,
        name: company.name,
      };
    }
  
    // Send welcome email including verification link
    await this.sendWelcomeEmail(user);
  
    return response;
  }

  async verifyEmail(token: string): Promise<{ loginUrl: string }> {
    const user = await this.usersRepository.findOne({
      where: { emailVerificationToken: token },
    });
  
    if (!user) {
      throw new NotFoundException('Invalid or expired token');
    }
  
    // Compare expiration time
    // if (new Date(user.emailVerificationExpires) < new Date()) {
    //   throw new BadRequestException('Token has expired');
    // }
  
    // Mark the user as verified
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
  
    await this.usersRepository.save(user);
  
    // Generate the login URL with the username in the query parameters
    const loginUrl = `http://localhost:6900/login?username=${encodeURIComponent(user.firstName)}`;
    console.log(loginUrl)
  
    return {loginUrl};
  }
  
  
  
  

  private getRegistrationMessage(role: UserRole): string {
    switch (role) {
      case UserRole.EMPLOYEE:
        return 'Registration successful. Please login to access your account.';
      case UserRole.SELLER:
        return 'Registration successful. Your account is pending verification. We will notify you once your account is approved.';
      default:
        return 'Registration successful.';
    }
  }

  private async sendWelcomeEmail(user: User): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST') || 'localhost',
      port: parseInt(this.configService.get('EMAIL_PORT', '1025')),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER') || 'm@gmail.com',
        pass: this.configService.get('EMAIL_PASSWORD') || 'miki',
      },
      tls: {
        rejectUnauthorized: false,
      },
      authMethod: 'PLAIN',
    });
  
    // Retrieve email template info
    const emailTemplateInfo = this.getEmailTemplate(user.role);
  
    // Ensure the user's email verification token exists
    if (!user.emailVerificationToken) {
      throw new Error('Email verification token is missing for the user.');
    }
  
    // Resolve the template path
    const templatePath = path.resolve(`./templates/${emailTemplateInfo.template}.html`);
  
    try {
      console.log('Template Path:', templatePath);
  
      // Check if the template file exists
      if (!fs.existsSync(templatePath)) {
        console.error('Template file not found:', templatePath);
        throw new Error('Email template file does not exist');
      }
  
      // Read and compile the template
      const source = fs.readFileSync(templatePath, 'utf-8');
      const template = Handlebars.compile(source);
  
      // Use the email verification token in the activation link
      const activationLink = `http://localhost:6900/auth/verify?token=${user.emailVerificationToken}`;
  
      const replacements = {
        activationLink,
        expiration: user.emailVerificationExpires.toISOString(), // Optional: Include expiration timestamp
      };
  
      const htmlToSend = template(replacements);
  
      await transporter.sendMail({
        from: this.configService.get('EMAIL_FROM') || 'm@gmail.com',
        to: user.email,
        subject: emailTemplateInfo.subject,
        html: htmlToSend,
        text: `Welcome to Shopeazz! To activate your account, visit: ${activationLink}`,
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }
  

  

  

  

  private getEmailTemplate(role: UserRole): any {
    switch (role) {
      case UserRole.EMPLOYEE:
        return {
          subject: 'Welcome to Our Platform',
          template: 'employee-welcome',
        };
      case UserRole.SELLER:
        return {
          subject: 'Seller Registration Received',
          template: 'seller-verification-pending',
        };
      default:
        return {
          subject: 'Welcome',
          template: 'general-welcome',
        };
    }
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<AuthTokensDto> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenDto.refreshToken, revoked: false },
      relations: ['user'],
    });

    if (!refreshToken || refreshToken.expires < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    const tokens = await this.generateAuthTokens(refreshToken.userId);

    // Revoke old refresh token
    refreshToken.revoked = true;
    refreshToken.revokedAt = new Date();
    refreshToken.replacedByToken = tokens.refreshToken;
    await this.refreshTokenRepository.save(refreshToken);

    // Save new refresh token
    await this.saveRefreshToken(
      refreshToken.userId,
      tokens.refreshToken,
      ipAddress,
      userAgent,
    );

    return tokens;
  }

  private async generateAuthTokens(userId: string): Promise<AuthTokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(userId, TokenType.ACCESS),
      this.generateToken(userId, TokenType.REFRESH),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  // Update the generateToken method
  private async generateToken(
    userId: string,
    type: TokenType,
  ): Promise<string> {
    const payload = {
      sub: userId,
      type,
      iat: Math.floor(Date.now() / 1000),
    };

    const expiresIn =
      type === TokenType.ACCESS
        ? this.configService.get('jwt.accessExpiration')
        : this.configService.get('jwt.refreshExpiration');

    return this.jwtService.signAsync(payload, { expiresIn });
  }

  private async saveRefreshToken(
    userId: string,
    token: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    const refreshToken = this.refreshTokenRepository.create({
      userId,
      token,
      ipAddress,
      userAgent,
    });
    await this.refreshTokenRepository.save(refreshToken);
  }

  // Update the logout method
  async logout(
    userId: string,
    refreshToken: string,
    accessToken: string,
  ): Promise<void> {
    // Blacklist the access token
    if (accessToken) {
      this.tokenBlacklistService.addToBlacklist(accessToken);
    }

    // Find and revoke the refresh token
    const token = await this.refreshTokenRepository.findOne({
      where: {
        userId,
        token: refreshToken,
        revoked: false,
      },
    });

    if (token) {
      token.revoked = true;
      token.revokedAt = new Date();
      await this.refreshTokenRepository.save(token);
    }
    // Cleanup expired tokens from blacklist periodically
    this.tokenBlacklistService.removeExpiredTokens();
  }
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      {
        userId,
        revoked: false,
      },
      {
        revoked: true,
        revokedAt: new Date(),
      },
    );
  }

  async revokeRefreshToken(tokenId: string): Promise<void> {
    await this.refreshTokenRepository.update(tokenId, {
      revoked: true,
      revokedAt: new Date(),
    });
  }
}
