import { Test, TestingModule } from '@nestjs/testing';
import { WeathersService } from './weathers.service';
import { AppModule } from '../app.module';

describe('WeathersService', () => {
  let service: WeathersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<WeathersService>(WeathersService);
  });

  it('should be defined', () => {
    // expect(service).toBeDefined();
  });
});
