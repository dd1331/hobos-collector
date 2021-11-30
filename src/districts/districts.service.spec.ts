import { Test, TestingModule } from '@nestjs/testing';
import { DistrictsService } from './districts.service';
import { AppModule } from '../app.module';

describe('DistrictsService', () => {
  let service: DistrictsService;
  let app;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<DistrictsService>(DistrictsService);
    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
