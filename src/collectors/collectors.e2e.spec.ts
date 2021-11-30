import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { CollectorsService } from './collectors.service';

describe('CollectorsService', () => {
  jest.setTimeout(30000);
  let app: INestApplication;
  let service;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    service = moduleRef.get<CollectorsService>(CollectorsService);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('CollectorsService', () => {
    it('get realtime air polution info', async () => {
      // await service.createRealtimeAirpo
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
