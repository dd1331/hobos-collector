import { Injectable } from '@nestjs/common';
import { Workbook, Worksheet } from 'exceljs';
import { AdminDistrict } from './entities/admin_district.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
@Injectable()
export class ExcelsService {
  constructor(
    @InjectRepository(AdminDistrict)
    private readonly adminDistrictRepo: Repository<AdminDistrict>,
  ) {}
  async getWorkbook(path: string) {
    const workbook = new Workbook();

    return await workbook.xlsx.readFile(path);
  }
  getWorksheet(workbook: Workbook, name: string) {
    const worksheet = workbook.getWorksheet(name);
    return worksheet;
  }
  getAdminDistrictData2save(worksheet: Worksheet) {
    const rowEnd = worksheet.actualRowCount;
    const rows = worksheet.getRows(4, rowEnd);
    const result: AdminDistrictType[] = [];
    rows
      .filter((row) => {
        return this.isEmptyRow(row);
      })
      .forEach((row) => {
        const data = this.getDataFromRow(row);
        result.push(data);
      });

    return result;
  }
  async createAdminDistrictData(data: AdminDistrictType[]) {
    const adminDistrict = this.adminDistrictRepo.create(data);
    const result = await this.adminDistrictRepo.save(adminDistrict);

    return result;
  }
  getDataFromRow(row) {
    return {
      provinceCode: row.getCell('B').text,
      province: row.getCell('C').text,
      cityCode: row.getCell('D').text,
      cityName: row.getCell('E').text,
      townCode: row.getCell('F').text,
      townName: row.getCell('G').text,
    };
  }
  isEmptyRow(row) {
    const { provinceCode, province, cityCode, cityName, townCode, townName } =
      this.getDataFromRow(row);
    const isEmpty =
      !province ||
      !provinceCode ||
      !cityCode ||
      !cityName ||
      !townCode ||
      !townName;
    return !isEmpty;
  }
  async getAdminDistrictList() {
    return await getRepository(AdminDistrict)
      .createQueryBuilder('adminDistrict')
      .select('cityCode')
      .groupBy('cityCode')
      .getRawMany();
  }
}
type AdminDistrictType = {
  provinceCode: string;
  province: string;
  cityCode: string;
  cityName: string;
  townCode: string;
  townName: string;
};
