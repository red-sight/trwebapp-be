import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import config from './config';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { AdminRoleGuard } from '@guards/admin.role.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const conf = config();
  const port = conf.port || '3001';

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

  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(new I18nValidationExceptionFilter());
  app.useGlobalGuards(new AdminRoleGuard(app.get(Reflector)));

  await app.listen(port);
  console.log(`App is listening on http://localhost:${port}`);
}
bootstrap();
