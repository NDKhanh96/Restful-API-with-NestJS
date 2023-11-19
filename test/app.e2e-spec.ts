import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

const PORT: number = 8080;
describe('App 2e2 test', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  beforeAll(async (): Promise<void> => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.listen(PORT);
    prismaService = app.get(PrismaService);
    await prismaService.cleanDataBase();
  });
  afterAll(async (): Promise<void> => {
    await app.close();
  });
  it.todo('should pass 1111');
});
