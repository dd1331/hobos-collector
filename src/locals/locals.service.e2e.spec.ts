import { Test, TestingModule } from '@nestjs/testing';
import { LocalsService } from './locals.service';
import { AppModule } from '../app.module';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { ReviewsService } from '../reviews/reviews.service';
import * as request from 'supertest';
import each from 'jest-each';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';

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

  describe('getLocalRanking', () => {
    it('take 만큼 반환', async () => {
      const take = 13;
      const { body } = await request(agent)
        .get('/locals/ranking')
        .query({ take })
        .expect(HttpStatus.OK);
      expect(body.length).toBe(take);
      body.forEach((result) => {
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
    it('기본 9개 반환', async () => {
      const DEFAULT_TAKE = 9;
      const { body } = await request(agent)
        .get('/locals/ranking')
        .query({
          take: DEFAULT_TAKE,
        })
        .expect(HttpStatus.OK);
      expect(body.length).toBe(DEFAULT_TAKE);
    });
    it('리턴할 값', async () => {
      const { body } = await request(agent)
        .get('/locals/ranking')
        .expect(HttpStatus.OK);

      body.forEach((result) => {
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
    const provinceNames = [
      '서울',
      '부산',
      '대구',
      '인천',
      '광주',
      '대전',
      '울산',
      '세종',
      '경기',
      '강원',
      '충북',
      '충남',
      '전북',
      '전남',
      '경북',
      '경남',
      '제주',
    ];
    each(provinceNames).it('시/도별 필터링', async (provinceName) => {
      const { body } = await request(agent)
        .get('/locals/ranking')
        .query({ provinceName })
        .expect(HttpStatus.OK);

      body.map((t) => t.provinceName);
      expect(
        body.every((local) => local.provinceName === provinceName),
      ).toBeTruthy();
    });
  });
  describe('getAreaCodesFromVisitKorea', () => {
    it('', async () => {
      return;
      const result = await localsService.getAreaCodesFromVisitKorea();
      expect(result.length).toBeGreaterThan(0);
    });
  });
  describe('getCityCodeFromVisitKorea', () => {
    it('', async () => {
      return;
      const result = await localsService.getAreaCodesFromVisitKorea(31);
      expect(result.length).toBeGreaterThan(0);
    });
  });
  describe('getCityImagesFromVisitKorea', () => {
    it('', async () => {
      return;
      const result = await localsService.getLocalImagesFromVisitKorea('제주시');
    });
  });
  describe('createImage4Local', () => {
    it('', async () => {
      return;
      const result = await localsService.createImage4Local();
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
      const dto: CreateReviewDto = {
        userId: 3,
        content: '성공 + 리뷰',
        code: cityCode.toString(),
        type: 'local',
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
    it('장소정보 가져오기', async () => {
      const cityCode = 11020;
      const { body } = await request(agent).get(`/locals/${cityCode}`);
      expect(body.places).toBeTruthy();
    });
  });
});
