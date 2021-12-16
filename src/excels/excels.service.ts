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
  getLocalData2save(worksheet: Worksheet) {
    const rowEnd = worksheet.actualRowCount;
    const rows = worksheet.getRows(4, rowEnd);
    const result: LocalType[] = rows
      .filter((row) => {
        return this.isCityLevel(row);
      })
      .map((row) => {
        const data = this.getDataFromRow(row);
        return data;
      });

    console.log('ExcelsService -> getLocalData2save -> result', result);
    return result;
  }

  getDataFromRow(row) {
    return {
      provinceCode: row.getCell('B').text || null,
      provinceName: row.getCell('C').text || null,
      cityCode: row.getCell('D').text || null,
      cityName: row.getCell('E').text || null,
      townCode: row.getCell('F').text || null,
      townName: row.getCell('G').text || null,
    };
  }
  isCityLevel(row) {
    const { townName, cityName } = this.getDataFromRow(row);
    return !townName && cityName;
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
      !provinceName &&
      !provinceCode &&
      !cityCode &&
      !cityName &&
      !townCode &&
      !townName;
    return !isEmpty;
  }
}
type LocalType = {
  provinceCode: string;
  provinceName: string;
  cityCode: string;
  cityName: string;
  townCode: string;
  townName: string;
};
