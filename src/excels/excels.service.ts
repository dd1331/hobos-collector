import { Injectable } from '@nestjs/common';
import { Workbook, Worksheet } from 'exceljs';
@Injectable()
export class ExcelsService {
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
      // .filter((row) => {
      //   return this.isEmptyRow(row);
      // })
      .forEach((row) => {
        const data = this.getDataFromRow(row);
        result.push(data);
      });

    return result;
  }

  getDataFromRow(row) {
    return {
      provinceCode: row.getCell('B').text,
      provinceName: row.getCell('C').text,
      cityCode: row.getCell('D').text,
      cityName: row.getCell('E').text,
      townCode: row.getCell('F').text,
      townName: row.getCell('G').text,
    };
  }
  isEmptyRow(row) {
    const {
      provinceCode,
      provinceName,
      cityCode,
      cityName,
      townCode,
      townName,
    } = this.getDataFromRow(row);
    const isEmpty =
      !provinceName ||
      !provinceCode ||
      !cityCode ||
      !cityName ||
      !townCode ||
      !townName;
    return !isEmpty;
  }
}
type AdminDistrictType = {
  provinceCode: string;
  provinceName: string;
  cityCode: string;
  cityName: string;
  townCode: string;
  townName: string;
};
