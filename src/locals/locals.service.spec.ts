import { Test, TestingModule } from '@nestjs/testing';
import { LocalsService } from './locals.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Local } from './entites/local.entity';
import { Weather } from '../weathers/entities/weather.entity';
import { FileEntity } from '../file.entity';
import { Place } from './entites/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { NotFoundException } from '@nestjs/common';

describe('LocalsService', () => {
  let service: LocalsService;
  let mockedLocalRepo, mockedPlaceRepo;

  beforeEach(async () => {
    mockedLocalRepo = {
      findOne: (option): Promise<Partial<Local>> => {
        const { where } = option;
        return Promise.resolve({ ...where });
      },
    };
    mockedPlaceRepo = {
      save: (place: CreatePlaceDto): Promise<Partial<Place>> => {
        return Promise.resolve(place);
      },
      findOne: (): Promise<Partial<Local>> => {
        return Promise.resolve({});
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalsService,
        { provide: getRepositoryToken(Local), useValue: mockedLocalRepo },
        { provide: getRepositoryToken(Weather), useValue: {} },
        { provide: getRepositoryToken(FileEntity), useValue: {} },
        { provide: getRepositoryToken(Place), useValue: mockedPlaceRepo },
      ],
    }).compile();
    service = module.get<LocalsService>(LocalsService);
  });

  describe('getLocalDetail', () => {
    const cityCode = 11100;
    it('성공', async () => {
      const result = await service.getLocalDetail(cityCode);
      expect(result.cityCode).toBe(cityCode);
    });
  });
  describe('create place', () => {
    const sample = {
      title: '나만의서재',
      link: 'http://blog.naver.com/inmyseojae',
      category: '문화,예술>복합문화공간',
      description: '',
      telephone: '',
      address: '전라남도 여수시 여서동 371-8',
      roadAddress: '전라남도 여수시 여문1로 22 자연드림 여서점 2층',
      mapx: '373295',
      mapy: '239243',
    };
    it('성공', async () => {
      const result = await service.createPlace(sample);
      expect(result.title).toBe(sample.title);
    });
    it('지역 정보 없음면 에러', async () => {
      mockedLocalRepo.findOne = () => Promise.resolve(null);
      const result = async () => await service.createPlace(sample);
      expect(result()).rejects.toThrowError(NotFoundException);
    });
  });
  describe('update place', () => {
    const description = 'updated';
    it('성공', async () => {
      const result = await service.updatePlace({
        description,
        id: 3,
      });
      expect(result.description).toBe(description);
    });
    it('장소 정보 없음면 에러', async () => {
      mockedPlaceRepo.findOne = () => Promise.resolve(null);
      const result = async () =>
        await service.updatePlace({
          description,
          id: 3,
        });
      expect(result()).rejects.toThrowError(NotFoundException);
    });
  });
});
