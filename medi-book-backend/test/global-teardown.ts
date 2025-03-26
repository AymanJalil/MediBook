import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';

export default async function globalTeardown() {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleFixture.createNestApplication();
  await app.close();  // Close the app to release resources
}
