import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { LocalsService } from '../locals/locals.service';
import { Weather } from '../weathers/entities/weather.entity';
import { FileEntity } from '../file.entity';
import { Local } from '../locals/entites/local.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Place } from '../places/entities/place.entity';
import { PlacesService } from '../places/places.service';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let mockedReviewRepo, mockedLocalRepo;

  beforeEach(async () => {
    mockedReviewRepo = {
      save: (dto: CreateReviewDto): Promise<Partial<Review>> =>
        Promise.resolve({ ...dto }),
    };
    mockedLocalRepo = {
      findOne: (option): Promise<Partial<Local>> => {
        return Promise.resolve({ ...option });
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        LocalsService,
        PlacesService,
        { provide: getRepositoryToken(Review), useValue: mockedReviewRepo },
        { provide: getRepositoryToken(Weather), useValue: {} },
        { provide: getRepositoryToken(FileEntity), useValue: {} },
        { provide: getRepositoryToken(Place), useValue: {} },
        { provide: getRepositoryToken(Local), useValue: mockedLocalRepo },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    const userId = 3;
    const cityCode = '10';
    const dto = { userId, cityCode, content: 'test' };
    it('리뷰 작성 성공', async () => {
      const result = await service.create(dto);
      const local = await mockedLocalRepo.findOne({ cityCode });
      expect(result.userId).toBe(userId);
      expect(result).toEqual({ ...dto, local });
    });
    it('리뷰할 지역 정보 없음', async () => {
      mockedLocalRepo.findOne = () => Promise.resolve();
      const result = async () => await service.create(dto);
      expect(result()).rejects.toThrowError(NotFoundException);
    });
    it('리뷰 작성 실패', async () => {
      mockedReviewRepo.save = () => Promise.resolve();
      const result = async () => await service.create(dto);
      expect(result()).rejects.toThrowError(BadRequestException);
    });
  });
});
