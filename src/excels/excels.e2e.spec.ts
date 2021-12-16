import { Test } from '@nestjs/testing';
import { ExcelsService } from './excels.service';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { LocalsService } from '../locals/locals.service';

describe('ExcelsService', () => {
  jest.setTimeout(30000);
  let app: INestApplication;
  let service, localsService;
  let workbook;
  let worksheet;
  let LocalDataList;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    service = moduleRef.get<ExcelsService>(ExcelsService);
    localsService = moduleRef.get<LocalsService>(LocalsService);
    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('ExcelsService', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(service.getWorksheet).toBeDefined();
      expect(service.getWorkbook).toBeDefined();
      expect(service.getLocalData2save).toBeDefined();
    });
    // just for admin local data initialization
    return;
    it('should have matching title', async () => {
      const path = '한국행정구역분류_행정동코드(7자리)_20210701기준.xlsx';
      workbook = await service.getWorkbook(path);
      expect(workbook.title).toBe('한국행정구역코드');
    });
    it('should return the same worksheet name', () => {
      const worksheetName = '1. 총괄표(현행)';
      worksheet = service.getWorksheet(workbook, worksheetName);
      expect(worksheet.name).toBe(worksheetName);
    });
    it('', () => {
      const data = service.getLocalData2save(worksheet);

      expect(data[0].provinceCode).toBeTruthy();
      expect(data[0].provinceName).toBeTruthy();
      expect(data[0].cityCode).toBeTruthy();
      expect(data[0].cityName).toBeTruthy();
      LocalDataList = data;
    });

    it('', async () => {
      const data = await localsService.createLocalData(LocalDataList);
      expect(data.length).toBe(LocalDataList.length);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
