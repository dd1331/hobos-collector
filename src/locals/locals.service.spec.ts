import { Test, TestingModule } from '@nestjs/testing';
import { LocalsService } from './locals.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Local } from './entites/local.entity';
import { Weather } from '../weathers/entities/weather.entity';
import { FileEntity } from '../file.entity';

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalsService,
        { provide: getRepositoryToken(Local), useValue: mockedLocalRepo },
        { provide: getRepositoryToken(Weather), useValue: {} },
        { provide: getRepositoryToken(FileEntity), useValue: {} },
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
});
