import * as request from 'supertest';

import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import each from 'jest-each';
import { ReviewsService } from './reviews.service';

describe('Reviews', () => {
  let app: INestApplication;
  let reviewsService: ReviewsService;

  let agent;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    reviewsService = moduleRef.get<ReviewsService>(ReviewsService);
    await app.init();
    agent = app.getHttpServer();
  });
  afterAll(async () => {
    await app.close();
  });
  describe('Create', () => {
    it('리뷰 작성 성공', async () => {
      const dto: CreateReviewDto = {
        userId: 3,
        code: '11100',
        content: 'tes',
        type: 'local',
      };
      const { body } = await request(agent).post('/reviews').send(dto);
      expect(body).toEqual(
        expect.objectContaining({
          userId: dto.userId,
          content: dto.content,
          updatedAt: expect.any(String),
          createdAt: expect.any(String),
          id: expect.any(Number),
          deletedAt: null,
        }),
      );
      expect(body.local.cityCode).toBe(dto.code);
    });
    const dtos2fail: Partial<CreateReviewDto & { status: number }>[] = [
      { content: 'test', userId: 3 },
      { userId: 3, code: '' },
      { code: '10', content: '123123' },
    ];

    each(dtos2fail).it('리뷰 작성 유효하지 않은 요청', async (dto) => {
      await request(agent)
        .post('/reviews')
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
  describe('getLocalReviews', () => {
    it('성공', async () => {
      const cityCode = 11100;
      await request(agent)
        .get(`/reviews/local/${cityCode}`)
        .expect(HttpStatus.OK);
    });
  });
  describe('getCafeReviews', () => {
    it('성공', async () => {
      const cafeCode = 841;
      await request(agent)
        .get(`/reviews/cafe/${cafeCode}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('delete reviews', () => {
    const dto: CreateReviewDto = {
      userId: 3,
      code: '11100',
      content: 'tes',
      type: 'local',
    };
    it('로컬 리뷰 삭제 성공', async () => {
      const { id } = await reviewsService.create(dto);
      const { body } = await request(agent)
        .delete(`/reviews/${id}`)
        .expect(HttpStatus.OK);
      expect(body.deletedAt).toBeTruthy();
    });
    it('로컬 리뷰 존재하지않음', async () => {
      const id = 9999999;
      const { body } = await request(agent)
        .delete(`/reviews/${id}`)
        .expect(HttpStatus.NOT_FOUND);
      expect(body.message).toBe('리뷰가 존재하지 않습니다');
    });
    it('숫자/숫자문자열이 아닐 경우 에러', async () => {
      const { id } = await reviewsService.create(dto);

      await request(agent)
        .delete(`/reviews/${id.toString()}`)
        .expect(HttpStatus.OK);

      await request(agent)
        .delete(`/reviews/simpleString`)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
