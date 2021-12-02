import { Injectable, HttpException, Inject } from '@nestjs/common';
import axios from 'axios';
import { REALTIME_AIR_POLUTION_URL } from '../constants/public_data.constants';

import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Weather } from './entities/weather.entity';
import { Repository } from 'typeorm';
import { DistrictsService } from '../districts/districts.service';

@Injectable()
export class WeathersService {
  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepo: Repository<Weather>,
    private readonly districtsService: DistrictsService,
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
      const { cityName, sidoName, pm10Value, pm25Value, o3Value, dataTime } =
        item;
      const realtimeAirPolutionInfo: RealtimeAirPolutionInfo = {
        cityName: cityName,
        provinceName: sidoName,
        pm10Value: pm10Value || -1,
        pm25Value: pm25Value || -1,
        o3Value: o3Value || -1,
        measuredAt: dayjs(dataTime).toDate(),
      };
      return realtimeAirPolutionInfo;
    });
    return result;
  }
  async upsertAirPolutionInfo(dto: RealtimeAirPolutionInfo) {
    try {
      const weather = this.weatherRepo.create(dto);
      return await this.weatherRepo.save(weather);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') return true;
    }
  }
}
type RealtimeAirPolutionInfo = {
  cityName: string;
  provinceName: string;
  pm10Value: number;
  pm25Value: number;
  o3Value: number;
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
