import { join } from 'path';

export default () => ({
  port: 3000,

  db: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'dev',
    password: 'dev',
    database: 'tgwebapp',
    schema: 'dev',
    entities: [join(__dirname, '../**', '*.entity.{ts,js}')],
    synchronize: true,
  },

  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
});
