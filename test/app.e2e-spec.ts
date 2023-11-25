import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';

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
    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });

  describe('Test Authentication', (): void => {
    describe('Register', (): void => {
      it('should Register', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'testemail01@gmail.com',
            password: '123456',
          })
          .expectStatus(201); // .inspect if you want to show req, res
      });
    });

    describe('Register', (): void => {
      it('should show error with empty email', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: '',
            password: '123456',
          })
          .expectStatus(400); // .inspect if you want to show req, res
      });
    });

    describe('Register', (): void => {
      it('should show error with invalid email', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'test',
            password: '123456',
          })
          .expectStatus(400); // .inspect if you want to show req, res
      });
    });

    describe('Register', (): void => {
      it('should show error with empty password', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'testemail01@gmail.com',
            password: '',
          })
          .expectStatus(400); // .inspect if you want to show req, res
      });
    });

    describe('Login', (): void => {
      it('should Login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: 'testemail01@gmail.com', password: '123456' })
          .expectStatus(201)
          .stores('accessToken', 'accessToken'); // save accessToken in to variable accessToken
      });
    });
  });

  describe('User', (): void => {
    describe('Get Detail User', (): void => {
      it('should get detail user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: '$S{accessToken}' })
          .expectStatus(200);
      });
    });
  });

  describe('Note', (): void => {
    describe('Get Detail User', (): void => {
      it('should get detail user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: '$S{accessToken}' })
          .expectStatus(200);
      });
    });
  });
  afterAll(async (): Promise<void> => {
    await app.close();
  });
});
