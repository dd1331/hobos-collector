import { Test } from '@nestjs/testing';
import { DistrictsService } from './districts.service';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';

describe('DistrictsService', () => {
  // jest.setTimeout(30000);
  let app: INestApplication;
  let service;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    service = moduleRef.get<DistrictsService>(DistrictsService);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('DistrictsService', () => {
    it('should be defined', () => {
      expect(service.getAdminDistrictList).toBeDefined();
      expect(service.createAdminDistrictData).toBeDefined();
    });
    it('', async () => {
      const data = await service.getAdminDistrictList();
      expect(data.length).toBeGreaterThan(0);
    });
    // it('', async () => {
    //   const data = await service.createAdminDistrictData(adminDistrictDataList);

    //   expect(data.length).toBe(adminDistrictDataList.length);
    // });
  });
  it('get realtime air polution info', async () => {
    const result = await service.getCityNames();
    console.log('result', result);
    expect(result.length).toBeGreaterThan(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
