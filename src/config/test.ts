import { join } from 'path';

export default () => ({
  db: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'dev',
    password: 'dev',
    database: 'tgwebapp',
    schema: 'test',
    entities: [join(__dirname, '../**', '*.entity.{ts,js}')],
    synchronize: true,
  },
});
