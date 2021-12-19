import { Test, TestingModule } from '@nestjs/testing';
import { LocalsService } from './locals.service';
import { AppModule } from '../app.module';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { ReviewsService } from '../reviews/reviews.service';
import * as request from 'supertest';

describe('LocalsService', () => {
  jest.setTimeout(300000);

  let localsService: LocalsService, reviewsService: ReviewsService;
  let app: INestApplication;
  let agent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    localsService = module.get<LocalsService>(LocalsService);
    reviewsService = module.get<ReviewsService>(ReviewsService);
    app = module.createNestApplication();
    await app.init();
    agent = app.getHttpServer();
  });
  afterAll(async () => {
    await app.close();
  });

  describe('', () => {
    it('should be defined', () => {
      expect(localsService).toBeDefined();
    });
    it('should return local info for main', async () => {
      const results = await localsService.getLocalRankingByCity({ take: 9 });
      // active after data initialized
      // return;
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
      return;
      const result = await localsService.getAreaCodeFromVisitKorea();
      expect(result.length).toBeGreaterThan(0);
    });
  });
  describe('getCityCodeFromVisitKorea', () => {
    it('', async () => {
      return;
      const result = await localsService.getAreaCodeFromVisitKorea(31);
      expect(result.length).toBeGreaterThan(0);
    });
  });
  describe('getCityImagesFromVisitKorea', () => {
    it('', async () => {
      return;
      const result = await localsService.getLocalImagesFromVisitKorea('시흥시');
      expect(result.every((r) => r.url)).toBeTruthy();
    });
  });
  describe('createImage4Local', () => {
    it('', async () => {
      return;
      const result = await localsService.createImage4Local();
      expect(result.every((r) => r.files.length > 0));
    });
  });
  describe('getLocalDetail', () => {
    const cityCode = 11020;
    it('성공', async () => {
      const result = await localsService.getLocalDetail(cityCode);
      expect(result.cityCode).toBe(cityCode.toString());
    });
    it('성공 + 리뷰', async () => {
      const cityCode = 11020;
      const dto = {
        userId: 3,
        content: '성공 + 리뷰',
        cityCode: cityCode.toString(),
      };
      await reviewsService.create(dto);
      const { body } = await request(agent).get(`/locals/${cityCode}`);
      expect(body.reviews.length).toBeGreaterThan(0);
      expect(body.reviews.pop()).toEqual(
        expect.objectContaining({
          userId: dto.userId,
          content: dto.content,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
          id: expect.any(Number),
        }),
      );
      expect(body.cityCode).toBe(cityCode.toString());
    });
    it('cityCode가 없는 경우 실패', async () => {
      const { body } = await request(agent).get(`/locals/string`);
      expect(body.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
