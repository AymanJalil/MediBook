import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { response } from 'express';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((response) => {
        expect(response.body).toEqual({message: 'Hello World!'});
      });
  });
});
