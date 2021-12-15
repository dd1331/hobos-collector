import { Test, TestingModule } from '@nestjs/testing';
import { LocalsService } from './locals.service';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';

describe('LocalsService', () => {
  jest.setTimeout(300000);

  let localsService: LocalsService;
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    localsService = module.get<LocalsService>(LocalsService);
    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  describe('', () => {
    it('should be defined', () => {
      expect(localsService).toBeDefined();
    });
    it('should return local info for main', async () => {
      const results = await localsService.getLocalRankingByCity();
      // active after data initialized
      // return;
      expect(results.length).toBeGreaterThan(0);
      results.forEach((result) => {
        expect(result.provinceCode).toBeTruthy();
        expect(result.cityCode).toBeTruthy();
        expect(result.townCode).toBeFalsy();
        expect(result.provinceName).toBeTruthy();
        expect(result.cityName).toBeTruthy();
        expect(result.townName).toBeFalsy();
        expect(result.o3Value).toBeDefined();
        expect(result.pm10Value).toBeDefined();
        expect(result.pm25Value).toBeDefined();
        expect(result.description).toBeDefined();
        expect(result.temp).toBeDefined();
        expect(result.feelsLike).toBeDefined();
        expect(result.humidity).toBeDefined();
      });
    });
  });
  describe('getAreaCodeFromVisitKorea', () => {
    it('', async () => {
      const result = await localsService.getAreaCodeFromVisitKorea();
      expect(result.length).toBeGreaterThan(0);
    });
  });
  describe('getCityCodeFromVisitKorea', () => {
    it('', async () => {
      const result = await localsService.getAreaCodeFromVisitKorea(31);
      expect(result.length).toBeGreaterThan(0);
    });
  });
  describe('getCityImagesFromVisitKorea', () => {
    it('', async () => {
      const result = await localsService.getLocalImagesFromVisitKorea('시흥시');
      expect(result.every((r) => r.url)).toBeTruthy();
    });
  });
  describe('createImage4Local', () => {
    it('', async () => {
      const result = await localsService.createImage4Local();
    });
  });
});
