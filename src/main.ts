import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import config from './config';

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

  await app.listen(port);
  console.log(`App is listening on http://localhost:${port}`);
}
bootstrap();
