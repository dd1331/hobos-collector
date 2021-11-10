import { Test, TestingModule } from '@nestjs/testing';
import { CollectorsService } from './collectors.service';

describe('CollectorsService', () => {
  let service: CollectorsService;
  let accessToken;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectorsService],
    }).compile();

    service = module.get<CollectorsService>(CollectorsService);
  });

  describe('', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(service.getAccessToken).toBeDefined();
      expect(service.getResidentInfo).toBeDefined();
      expect(service.getGenderRatio).toBeDefined();
    });
    it('should return errCd 0 and accessToken', async () => {
      const data = await service.getAccessToken();
      accessToken = data.result.accessToken;
      expect(data.result.accessToken).toBeTruthy();
      expect(data.errCd).toBe(0);
    });
  });
  describe('', () => {
    it('', async () => {
      const data = await service.getResidentInfo({
        accessToken,
        adm_cd: '3902011',
      });
      expect(data.errCd).toBe(0);
    });
  });
  describe('', () => {
    it('', async () => {
      const data = await service.getGenderRatio({
        accessToken,
        adm_cd: '11190',
      });
      expect(data.errCd).toBe(0);
      expect(data.result[0].adm_nm).toBeDefined();
      expect(data.result[0].f_per).toBeDefined();
      expect(data.result[0].m_per).toBeDefined();
      expect(data.result[0].f_ppl).toBeDefined();
      expect(data.result[0].m_ppl).toBeDefined();
      expect(data.result[0].total_ppl).toBeDefined();
    });
  });
});
