import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class AuthHelper {
  initData: string;
  app: INestApplication;

  constructor(app: INestApplication, initData: string) {
    this.initData = initData;
    this.app = app;
  }

  public signIn() {
    return request(this.app.getHttpServer())
      .post('/auth')
      .send({ initData: this.initData });
  }
}
