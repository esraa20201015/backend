/* eslint-disable @typescript-eslint/no-unsafe-call */
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host:
    process.env.DATABASE_HOST ||
    'db-postgresql-nyc3-94508-do-user-6337734-0.c.db.ondigitalocean.com',
  port: parseInt(process.env.DATABASE_PORT ?? '25060', 10),

  name: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  synchronize: process.env.DATABASE_SYNC === 'true',
  autoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true', 
}));
