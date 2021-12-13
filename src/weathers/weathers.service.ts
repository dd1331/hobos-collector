import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import { REALTIME_AIR_POLUTION_URL } from '../constants/public_data.constants';

import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Weather } from './entities/weather.entity';
import { Repository } from 'typeorm';
import { PROVINCE_NAMES_SHORT } from '../constants/districts.constants';

@Injectable()
export class WeathersService {
  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepo: Repository<Weather>,
  ) {}
  async getAirPolutionInfoByProvince(
    provinceName: ProvinceName,
  ): Promise<WeatherInfo[]> {
    try {
      const params = this.getParams4AirPolutionInfo(provinceName);
      const { data, status, statusText } = await axios.get(
        REALTIME_AIR_POLUTION_URL,
        { params },
      );
      const { header, body, pageNo } = data.response;
      // TODO: retry depending on pageNo
      if (header.resultCode !== '00')
        throw new HttpException(statusText, status);

      return this.formatAirPolutionInfo(body.items);
    } catch (error) {
      // TODO: send noti
    }
  }
  private getParams4AirPolutionInfo(
    sidoName: ProvinceName,
  ): Param4AirPolutionInfo {
    return {
      serviceKey:
        'sqcYoxiPGJmWv+7+X1pPjExvgKbD5IhInUB7bJCtIQZ881DodxmENiH4r2FUHjL0F4cpDreKpxVIO/AeycV8Dw==',
      sidoName,
      searchCondition: 'HOUR',
      returnType: 'json',
      numOfRows: '30',
    };
  }

  private formatAirPolutionInfo(items): WeatherInfo[] {
    const result = items.map((item) => {
      const { cityName, sidoName, pm10Value, pm25Value, o3Value, dataTime } =
        item;
      const weatherInfo: WeatherInfo = {
        cityName: cityName,
        provinceName: sidoName,
        pm10Value: pm10Value || -1,
        pm25Value: pm25Value || -1,
        o3Value: o3Value || -1,
        measuredAt: dayjs(dataTime).toDate(),
      };
      return weatherInfo;
    });
    return result;
  }
  async upsertAirPolutionInfo(dto: WeatherInfo) {
    try {
      const weather = this.weatherRepo.create(dto);

      return await this.weatherRepo.save(weather);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') return true;
    }
  }
  async createWeatherInfo() {
    const weatherInfoList = await this.getWeatherInfoList();
    const promises = weatherInfoList.flat().map(async (weatherInfo) => {
      try {
        const weather = await this.getWeatherInfo(weatherInfo);

        await this.upsertAirPolutionInfo({ ...weatherInfo, ...weather });

        return weatherInfo;
      } catch (error) {}
    });

    const result = await Promise.all(promises);
    return result;
  }

  private async getWeatherInfoList() {
    const promises = PROVINCE_NAMES_SHORT.map(
      async (provinceName: ProvinceName) => {
        return await this.getAirPolutionInfoByProvince(provinceName);
      },
    );
    const weatherInfoList = await Promise.all(promises);
    return weatherInfoList;
  }

  private async getWeatherInfo(result: WeatherInfo): Promise<{
    description: string;
    temp: number;
    feelsLike: number;
    humidity: number;
  }> {
    const { data } = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          lang: 'kr',
          appid: '4a93d60067a3dd5f2f5790f9472a6bd0',
          q: result.cityName,
          units: 'metric',
        },
      },
    );

    const description = data.weather[0].description;
    const feelsLike = Math.round(data.main.temp);
    const temp = Math.round(data.main.feels_like);
    const humidity = Math.round(data.main.humidity);
    return { description, feelsLike, temp, humidity };
  }
}
type WeatherInfo = {
  cityName: string;
  provinceName: string;
  pm10Value?: number;
  pm25Value?: number;
  o3Value?: number;
  description?: string;
  temp?: number;
  feelsLike?: number;
  humidity?: number;
  measuredAt?: Date;
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
  | '경북'
  | '경남'
  | '제주'
  | '세종';
type Param4AirPolutionInfo = {
  serviceKey: string;
  sidoName: ProvinceName;
  searchCondition: string;
  returnType: string;
  numOfRows: string;
};
