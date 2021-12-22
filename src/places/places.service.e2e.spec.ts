import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { CreatePlaceDto } from './dto/create-place.dto';
import each from 'jest-each';
import {
  LOCAL_NOT_FOUND_MESSAGE,
  TITLE_IS_EMPTY_MESSAGE,
  ADDRESS_IS_EMPTY_MESSAGE,
  ROARDADDRESS_IS_EMPTY_MESSAGE,
  MAPX_IS_EMPTY_MESSAGE,
  MAPY_IS_EMPTY_MESSAGE,
} from '../constants/locals.constants';
import { PlacesService } from './places.service';

describe('PlacesService', () => {
  jest.setTimeout(300000);

  let placesService: PlacesService;
  let app: INestApplication;
  let agent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    placesService = module.get<PlacesService>(PlacesService);
    app = module.createNestApplication();
    await app.init();
    agent = app.getHttpServer();
  });
  afterAll(async () => {
    await app.close();
  });

  describe('createPlace', () => {
    const dto: CreatePlaceDto = {
      title: '나만의서재',
      link: 'http://blog.naver.com/inmyseojae',
      category: '문화,예술>복합문화공간',
      description: '',
      address: '전라남도 여수시 여서동 371-8',
      roadAddress: '전라남도 여수시 여문1로 22 자연드림 여서점 2층',
      mapx: '373295',
      mapy: '239243',
    };
    it('성공', async () => {
      const { body } = await request(agent)
        .post(`/places/place`)
        .send(dto)
        .expect(HttpStatus.CREATED);
      // console.log(body);
      expect(body.title).toBe(dto.title);
    });
    const dtos4badRespuest: Partial<
      CreatePlaceDto & { expected: number; message: string }
    >[] = [
      {
        ...dto,
        title: '',
        expected: HttpStatus.BAD_REQUEST,
        message: TITLE_IS_EMPTY_MESSAGE,
      },
      {
        ...dto,
        address: '',
        expected: HttpStatus.BAD_REQUEST,
        message: ADDRESS_IS_EMPTY_MESSAGE,
      },
      {
        ...dto,
        roadAddress: '',
        expected: HttpStatus.BAD_REQUEST,
        message: ROARDADDRESS_IS_EMPTY_MESSAGE,
      },
      {
        ...dto,
        mapx: '',
        expected: HttpStatus.BAD_REQUEST,
        message: MAPX_IS_EMPTY_MESSAGE,
      },
      {
        ...dto,
        mapy: '',
        expected: HttpStatus.BAD_REQUEST,
        message: MAPY_IS_EMPTY_MESSAGE,
      },
    ];
    each(dtos4badRespuest).it('createPlace Bad request', async (dto2Fail) => {
      const { expected, message, ...dto } = dto2Fail;
      const { body } = await request(agent)
        .post(`/places/place`)
        .send(dto)
        .expect(expected);
      expect(body.message[0]).toBe(message);
    });
    const dtos4NotFound: Partial<CreatePlaceDto & { expected: number }>[] = [
      { ...dto, address: 'ddd dd', expected: HttpStatus.NOT_FOUND },
    ];
    each(dtos4NotFound).it('createPlace NotFound', async (dto2Fail) => {
      const { expected, ...dto } = dto2Fail;
      const { body } = await request(agent).post(`/places/place`).send(dto);
      expect(body.statusCode).toBe(expected);
      expect(body.message).toBe(LOCAL_NOT_FOUND_MESSAGE);
    });
  });
  describe('getCafeRanking', () => {
    it('', async () => {
      const dto = { take: 10 };
      const { body } = await request(agent)
        .get(`/places/cafe/ranking`)
        .query(dto)
        .expect(HttpStatus.OK);
      expect(body.length).toBe(dto.take);
    });
  });
});
