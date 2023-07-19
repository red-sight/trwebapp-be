import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const conf = config();
  const port = conf.port || '3001';

  await app.listen(port);
  console.log(`App is listening on http://localhost:${port}`);
}
bootstrap();
