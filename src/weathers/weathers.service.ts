import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import { REALTIME_AIR_POLUTION_URL } from '../constants/public_data.constants';

import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Weather } from './entities/weather.entity';

@Injectable()
export class WeathersService {
  constructor(
    @InjectRepository(Weather) private readonly weatherRepo: Weather,
  ) {}
  async getRealtimeAirPolutionInfoByProvinceName(
    provinceName: ProvinceName,
  ): Promise<RealtimeAirPolutionInfo[]> {
    try {
      const params = this.getParams4RealtimeAirPolutionInfo(provinceName);
      const { data, status, statusText } = await axios.get(
        REALTIME_AIR_POLUTION_URL,
        { params },
      );
      const { header, body, pageNo } = data.response;
      // TODO: retry depending on pageNo
      if (header.resultCode !== '00')
        throw new HttpException(statusText, status);

      return this.formatRealtimeAirPolutionInfo(body.items);
    } catch (error) {
      // TODO: send noti
    }
  }
  private getParams4RealtimeAirPolutionInfo(
    sidoName: ProvinceName,
  ): Param4RealtimeAirPolutionInfo {
    return {
      serviceKey:
        'sqcYoxiPGJmWv+7+X1pPjExvgKbD5IhInUB7bJCtIQZ881DodxmENiH4r2FUHjL0F4cpDreKpxVIO/AeycV8Dw==',
      sidoName,
      searchCondition: 'HOUR',
      returnType: 'json',
      numOfRows: '30',
    };
  }

  private formatRealtimeAirPolutionInfo(items): RealtimeAirPolutionInfo[] {
    const result = items.map((item) => {
      const realtimeAirPolutionInfo: RealtimeAirPolutionInfo = {
        cityName: item.cityName,
        provinceName: item.sidoName,
        pm10Value: item.pm10Value || '수집중',
        pm25Value: item.pm25value || '수집중',
        o3Value: item.o3Value || '수집중',
        measuredAt: dayjs(item.dataTime).toDate(),
      };
      return realtimeAirPolutionInfo;
    });
    return result;
  }
  upsertAirPolutionInfo(dto) {
    console.log(dto);
  }
}
type RealtimeAirPolutionInfo = {
  cityName: string;
  provinceName: string;
  pm10Value: string | '수집중';
  pm25Value: string | '수집중';
  o3Value: string | '수집중';
  measuredAt: Date;
};
type ProvinceName =
  | '서울'
  | '부산'
  | '대구'
  | '인천'
  | '광주'
  | '대전'
  | '울산'
  | '경기'
  | '강원'
  | '충북'
  | '충남'
  | '전북'
  | '전남'
  | '경북'
  | '경남'
  | '제주'
  | '세종';
type Param4RealtimeAirPolutionInfo = {
  serviceKey: string;
  sidoName: ProvinceName;
  searchCondition: string;
  returnType: string;
  numOfRows: string;
};
