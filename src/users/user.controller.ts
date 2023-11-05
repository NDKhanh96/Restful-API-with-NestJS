import { Controller, Get, UseGuards } from '@nestjs/common';
import { CustomJwtGuard } from '../auth/guard';
import { GetUser } from '../decorator';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  @UseGuards(CustomJwtGuard)
  @Get('me')
  me(@GetUser() user: User) {
    //request come from validate of Jwt.strategy
    return user;
  }
}
