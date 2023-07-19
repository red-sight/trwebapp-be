export default () => ({
  db: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'dev',
    password: 'dev',
    database: 'tgwebapp',
    schema: 'test',
    entities: ['**/*.entity{.ts,.js}'],
  },
});
