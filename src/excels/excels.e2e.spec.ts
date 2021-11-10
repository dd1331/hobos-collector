import { Test } from '@nestjs/testing';
import { ExcelsService } from './excels.service';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';

describe('ExcelsService', () => {
  jest.setTimeout(30000);
  let app: INestApplication;
  let service;
  let workbook;
  let worksheet;
  let adminDistrictDataList;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    service = moduleRef.get<ExcelsService>(ExcelsService);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('ExcelsService', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(service.getWorksheet).toBeDefined();
      expect(service.getWorkbook).toBeDefined();
      expect(service.getAdminDistrictData2save).toBeDefined();
      expect(service.createAdminDistrictData).toBeDefined();
    });
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
      const data = service.getAdminDistrictData2save(worksheet);

      expect(data[0].provinceCode).toBeDefined();
      expect(data[0].province).toBeDefined();
      expect(data[0].cityCode).toBeDefined();
      expect(data[0].city).toBeDefined();
      expect(data[0].townCode).toBeDefined();
      expect(data[0].town).toBeDefined();
      adminDistrictDataList = data;
    });
    it('', async () => {
      const data = await service.createAdminDistrictData(adminDistrictDataList);

      expect(data.length).toBe(adminDistrictDataList.length);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
