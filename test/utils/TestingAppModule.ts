import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import {
  I18nModule,
  QueryResolver,
  AcceptLanguageResolver,
  I18nValidationPipe,
} from 'nestjs-i18n';
import { createClient } from 'redis';
import * as path from 'path';

export class TestingAppModule {
  static async init(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '../../src/i18n/'),
            watch: true,
          },
          resolvers: [
            { use: QueryResolver, options: ['lang'] },
            AcceptLanguageResolver,
          ],
          typesOutputPath: path.join(
            __dirname,
            '../../src/generated/i18n.generated.ts',
          ),
        }),
      ],
    }).compile();
    const app: INestApplication = moduleFixture.createNestApplication();
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
    await app.init();
    return app;
  }
}
