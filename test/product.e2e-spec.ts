import { INestApplication } from '@nestjs/common';
import { TestingAppModule } from './utils/TestingAppModule';
import { AuthHelper } from './utils/AuthHelper';
import * as request from 'supertest';
import { DatabaseUtil } from './utils/DatabaseUtil';

describe('Products', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  const initData =
    'auth_date=1689778707278&hash=3dbaf57025a68433b8cf03e25274bbe83d55ee0b533d17211255856d58fb7312&user=%7B%22id%22%3A5606694108%2C%22username%22%3A%22Rosalia87%22%2C%22last_name%22%3A%22Wisoky%22%2C%22first_name%22%3A%22Wade%22%2C%22language_code%22%3A%22EN%22%7D';

  beforeEach(async () => {
    app = await TestingAppModule.init();
    authHelper = new AuthHelper(app, initData);
    const databaseUtil = new DatabaseUtil(app);
    await databaseUtil.clearAll();
  });

  describe('list products', () => {
    it('list', async () => {
      const signinRes = await authHelper.signIn();
      const res = await request(app.getHttpServer())
        .get('/product')
        .set('Cookie', [signinRes.headers['set-cookie']]);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(0);
      // console.log(res.body);
    });
  });
});
