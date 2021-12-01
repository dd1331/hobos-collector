import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { WeathersService } from './weathers.service';
import each from 'jest-each';
import { PROVINCE_NAMES_SHORT } from '../constants/districts.constants';

describe('WeathersService', () => {
  jest.setTimeout(30000);
  let app: INestApplication;
  let service;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    service = moduleRef.get<WeathersService>(WeathersService);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('WeathersService', () => {
    const tasks = [];
    it('get realtime air polution info', async () => {
      // for (const provinceName of PROVINCE_NAMES_SHORT) {
      //   const provinceResults =
      //     await service.getRealtimeAirPolutionInfoByProvinceName(provinceName);
      //   provinceResults.forEach((result) => {
      //     expect(result.cityName).toBeDefined();
      //     expect(result.measuredAt).toBeDefined();
      //     expect(result.o3Value).toBeDefined();
      //     expect(result.pm10Value).toBeDefined();
      //     expect(result.pm25Value).toBeDefined();
      //     expect(result.provinceName).toBeDefined();
      //   });
      //   tasks.push(...provinceResults);
      // }
    });
    it('create weather info', () => {
      tasks.forEach((dto) => {
        // const result = service.upsertAirPolutionInfo(dto);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
