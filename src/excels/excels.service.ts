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
      provinceName: this.format(row.getCell('C').text) || null,
      cityCode: row.getCell('D').text || null,
      cityName: row.getCell('E').text || null,
      townCode: row.getCell('F').text || null,
      townName: row.getCell('G').text || null,
    };
  }
  format(name) {
    if (name === '인천광역시') return '인천';
    if (name === '광주광역시') return '광주';
    if (name === '대전광역시') return '대전';
    if (name === '울산광역시') return '울산';
    if (name === '세종특별자치시') return '세종';
    if (name === '경기도') return '경기';
    if (name === '강원도') return '강원';
    if (name === '충청북도') return '충북';
    if (name === '충청남도') return '충남';
    if (name === '전라북도') return '전북';
    if (name === '전라남도') return '전남';
    if (name === '경상북도') return '경북';
    if (name === '경상남도') return '경남';
    if (name === '대구광역시') return '대구';
    if (name === '서울특별시') return '서울';
    if (name === '부산광역시') return '부산';
    if (name === '제주특별자치도') return '제주';
    return name;
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
