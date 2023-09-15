import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import * as session from 'express-session';
import {
  AcceptLanguageResolver,
  I18nModule,
  I18nValidationPipe,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '../src/i18n/'),
            watch: true,
          },
          resolvers: [
            { use: QueryResolver, options: ['lang'] },
            AcceptLanguageResolver,
          ],
          typesOutputPath: path.join(
            __dirname,
            '../src/generated/i18n.generated.ts',
          ),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    const redisClient = createClient();
    await redisClient.connect();
    const redisStore = new RedisStore({
      client: redisClient,
      prefix: 'tgwebapp:',
    });

    app.use(
      session({
        store: redisStore,
        secret: 'my-secret',
        resave: false,
        saveUninitialized: false,
      }),
    );

    app.useGlobalPipes(new I18nValidationPipe());

    return await app.init();
  });

  it('/auth (POST)', () => {
    const webAppInitDataString =
      'auth_date=1689778707278&hash=3dbaf57025a68433b8cf03e25274bbe83d55ee0b533d17211255856d58fb7312&user=%7B%22id%22%3A5606694108%2C%22username%22%3A%22Rosalia87%22%2C%22last_name%22%3A%22Wisoky%22%2C%22first_name%22%3A%22Wade%22%2C%22language_code%22%3A%22EN%22%7D';

    request(app.getHttpServer())
      .post('/auth')
      .send({ initData: webAppInitDataString })
      .expect(201)
      .then((res) => {
        console.dir(res.body, { depth: null });
        expect(res.body).toBeTruthy();
        /*  expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            tgId: expect.any(String),
            tgInitData: expect.objectContaining({
              id: 5606694108,
              username: 'Rosalia87',
              last_name: 'Wisoky',
              first_name: 'Wade',
              language_code: 'EN',
            }),
          }),
        ); */
      });
  });

  it('/auth (POST) missing input data', () => {
    request(app.getHttpServer())
      .post('/auth')
      .send({})
      .expect(400)
      .then((res) => {
        // console.dir(res.body, { depth: null });
        expect(res.body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            message: 'Bad Request',
            errors: [
              {
                property: 'initData',
                children: [],
                constraints: { isNotEmpty: "'initData' field is required" },
              },
            ],
          }),
        );
      });
  });
});
