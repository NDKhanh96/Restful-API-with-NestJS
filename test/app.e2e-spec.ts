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
    describe('Insert note', (): void => {
      it('insert first note', () => {
        return pactum
          .spec()
          .post('/notes')
          .withHeaders({
            Authorization: '$S{accessToken}',
          })
          .withBody({
            title: 'This is title 11',
            description: 'description 11',
            url: 'www.yahoo.com',
          })
          .expectStatus(201)
          .stores('nodeId01', 'id')
          .inspect();
      });
      it('insert second note', () => {
        return pactum
          .spec()
          .post('/notes')
          .withHeaders({
            Authorization: '$S{accessToken}',
          })
          .withBody({
            title: 'This is title 222',
            description: 'description 222',
            url: 'www.twitter.com',
          })
          .expectStatus(201)
          .stores('nodeId02', 'id')
          .inspect();
      });
      it('get Note by id}', () => {
        return pactum
          .spec()
          .get('/notes')
          .withHeaders({
            Authorization: '$S{accessToken}',
          })
          .withPathParams('id', '${nodeId01}')
          .expectStatus(200);
      });
      it('get All Notes', () => {
        return pactum
          .spec()
          .get('/notes')
          .withHeaders({
            Authorization: '$S{accessToken}',
          })
          .inspect()
          .expectStatus(200);
      });
      it('delete note by ID', () => {
        return pactum
          .spec()
          .delete('/notes')
          .withHeaders({
            Authorization: '$S{accessToken}',
          })
          .withQueryParams('id', '$S{nodeId02}')
          .inspect()
          .expectStatus(204);
      });
    });
  });
  afterAll(async (): Promise<void> => {
    await app.close();
  });
});
