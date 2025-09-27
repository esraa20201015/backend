import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close(); // prevents Jest from hanging
  });

  it('/ (GET)', () => {
    console.log(process.env.NODE_ENV);
    console.log(process.env.S3_BUCKET);

    return request(app.getHttpServer()).get('/').expect(404);
  });
});
