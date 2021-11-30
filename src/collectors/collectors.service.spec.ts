import { Test, TestingModule } from '@nestjs/testing';
import { CollectorsService } from './collectors.service';
import { AppModule } from '../app.module';
import each from 'jest-each';
describe('CollectorsService', () => {
  jest.setTimeout(300000);
  let service: CollectorsService;
  let accessToken;
  let app;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<CollectorsService>(CollectorsService);
    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  describe('', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(service.getAccessToken).toBeDefined();
      expect(service.getResidentInfo).toBeDefined();
      expect(service.getGenderRatio).toBeDefined();
      expect(service.getGenderRatioList).toBeDefined();
      expect(service.createGenderRatioData).toBeDefined();
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
  it('', async () => {
    const admCdList = ['11190', '11200'];
    const data = await service.getGenderRatioList({
      accessToken,
      admCdList,
    });
    expect(data.length).toBe(admCdList.length);
  });
  const sidoNames = [
    // '서울',
    // '부산',
    // '대구',
    // '인천',
    // '광주',
    // '대전',
    // '울산',
    // '경기',
    // '강원',
    // '충북',
    // '충남',
    // '전북',
    '전남',
    // '경북',
    // '경남',
    // '제주',
    // '세종',
  ];
  each(sidoNames).it('get realtime air polution info', async (sidoName) => {
    const [result] = await service.getRealtimeAirPolutionInfo(sidoName);
    expect(result.cityName).toBeDefined();
    expect(result.createdAt).toBeDefined();
    expect(result.o3Value).toBeDefined();
    expect(result.pm10Value).toBeDefined();
    expect(result.pm25Value).toBeDefined();
    expect(result.sidoName).toBeDefined();

    // results.forEach((result) => {
    //   expect(result.cityName).toBeDefined();
    //   expect(result.createdAt).toBeDefined();
    //   expect(result.o3Value).toBeDefined();
    //   expect(result.pm10Value).toBeDefined();
    //   expect(result.pm25Value).toBeDefined();
    //   expect(result.sidoName).toBeDefined();
    // });
  });
});
