import { Test } from '@nestjs/testing';
import { DistrictsService } from './districts.service';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { PROVINCE_NAMES_SHORT } from '../constants/districts.constants';
import each from 'jest-each';

describe('DistrictsService', () => {
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
      expect(service.getCityList).toBeDefined();
      expect(service.createAdminDistrictData).toBeDefined();
    });
    it('', async () => {
      const data = await service.getCityList();
      expect(data.length).toBeGreaterThan(0);
    });
    each(PROVINCE_NAMES_SHORT).it('get getCityNames', async (provinceName) => {
      const [result] = await service.getCityNamesByProvinceName(provinceName);
      const isIncluding = result.provinceName.includes(provinceName);
      const isShortened =
        result.provinceName[0] + result.provinceName[2] === provinceName;
      expect(isIncluding || isShortened).toBeTruthy();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
