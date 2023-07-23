import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import * as session from 'express-session';

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const redisClient = createClient();
    redisClient.connect().catch(console.error);

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

    await app.init();
  });

  it('/signup (POST)', () => {
    const webAppInitDataString =
      'auth_date=1689778707278&hash=3dbaf57025a68433b8cf03e25274bbe83d55ee0b533d17211255856d58fb7312&user=%7B%22id%22%3A5606694108%2C%22username%22%3A%22Rosalia87%22%2C%22last_name%22%3A%22Wisoky%22%2C%22first_name%22%3A%22Wade%22%2C%22language_code%22%3A%22EN%22%7D';

    return request(app.getHttpServer())
      .post('/auth')
      .send({ initData: webAppInitDataString })
      .expect(201)
      .then((res) => {
        console.log(res.body);
      });
  });
});
