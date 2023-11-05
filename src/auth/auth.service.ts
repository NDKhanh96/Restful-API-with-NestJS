import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from '../dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(
    authDTO: AuthDto,
  ): Promise<{ accessToken: string } | { error: any }> {
    try {
      const hashedPassword: string = await argon.hash(authDTO.password);
      const user: User = await this.prismaService.user.create({
        data: {
          email: authDTO.email,
          hashedPassword: hashedPassword,
          firstName: '',
          lastName: '',
        },
        select: {
          id: true,
          email: true,
          hashedPassword: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return await this.convertToJwtString(user.id, user.email);
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ForbiddenException('Error in credentials');
      } else {
        return { error: e };
      }
    }
  }

  async login(
    authDTO: AuthDto,
  ): Promise<{ accessToken: string } | UnauthorizedException | { error: any }> {
    try {
      const user: User = await this.findUserByEmail(authDTO.email);

      if (!user) {
        return new UnauthorizedException('Incorrect username');
      }

      const passwordMatched = await this.verifyPassword(
        user.hashedPassword,
        authDTO.password,
      );

      if (!passwordMatched) {
        return new UnauthorizedException('Incorrect password');
      }

      return await this.convertToJwtString(user.id, user.email);
    } catch (e) {
      return { error: e };
    }
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  private async verifyPassword(
    hashedPassword: string,
    password: string,
  ): Promise<boolean> {
    return await argon.verify(hashedPassword, password);
  }

  async convertToJwtString(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload: { sub: number; email: string } = {
      sub: userId,
      email,
    };
    const jwtString: string = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return { accessToken: `Bearer ${jwtString}` };
  }
}
