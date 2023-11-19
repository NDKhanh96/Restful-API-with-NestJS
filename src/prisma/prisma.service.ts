import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: { url: configService.get<string>('DATABASE_URL') },
      },
    });
    console.log(`db url: ${configService.get<string>('DATABASE_URL')}`);
  }

  cleanDataBase() {
    // in one - many relation, must delete many first then delete one
    return this.$transaction([
      // $transaction: if 1 command below is error, $transaction will revert all command
      this.note.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
