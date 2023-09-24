import { INestApplication } from '@nestjs/common';
import { TestingAppModule } from './utils/TestingAppModule';
import * as request from 'supertest';
import { DatabaseUtil } from './utils/DatabaseUtil';

describe('Products', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await TestingAppModule.init();
    const databaseUtil = new DatabaseUtil(app);
    await databaseUtil.clearAll();
  });

  describe('init root admin user', () => {
    it('init root admin user: success', async () => {
      const agent = request.agent(app.getHttpServer());
      const res = await agent.post('/admin/init_su').send({
        email: 'admin@test.com',
        password: 'P@ssw0rd',
      });
      const resMe = await agent.get('/admin/me');
      console.log(resMe.text);
    });
  });
});
