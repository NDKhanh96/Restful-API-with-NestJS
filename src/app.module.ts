import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { NoteModule } from './note/note.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [AuthModule, UserModule, NoteModule, PrismaModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
