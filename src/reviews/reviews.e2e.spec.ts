import * as request from 'supertest';

import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import each from 'jest-each';

describe('Reviews', () => {
  let app: INestApplication;

  let agent;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
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
        cityCode: '11100',
        content: 'tes',
      };
      const { body } = await request(agent).post('/reviews').send(dto);
      expect(body).toEqual(
        expect.objectContaining({
          userId: dto.userId,
          cityCode: dto.cityCode,
          content: dto.content,
          updatedAt: expect.any(String),
          createdAt: expect.any(String),
          id: expect.any(Number),
          deletedAt: null,
        }),
      );
      expect(body.local.cityCode).toBe(dto.cityCode);
    });
  });
  const dtos2fail: Partial<CreateReviewDto & { status: number }>[] = [
    { content: 'test', userId: 3 },
    { userId: 3, cityCode: '' },
    { cityCode: '10', content: '123123' },
  ];

  each(dtos2fail).it('리뷰 작성 유효하지 않은 요청', async (dto) => {
    const { body } = await request(agent)
      .post('/reviews')
      .send(dto)
      .expect(HttpStatus.BAD_REQUEST);
  });
});
