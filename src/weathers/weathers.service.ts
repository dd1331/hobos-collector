import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import { REALTIME_AIR_POLUTION_URL } from '../constants/public_data.constants';

import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Weather } from './entities/weather.entity';
import { Repository, LessThanOrEqual } from 'typeorm';
import { PROVINCE_NAMES_SHORT } from '../constants/locals.constants';
import { Cron, CronExpression } from '@nestjs/schedule';

type OpenWeather = {
  description: string;
  temp: number;
  feelsLike: number;
  humidity: number;
};

@Injectable()
export class WeathersService {
  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepo: Repository<Weather>,
  ) {}
  private readonly logger = new Logger(WeathersService.name);
  async getCityLevelAirPolution(
    provinceName: ProvinceName,
  ): Promise<WeatherInfo[]> {
    try {
      const params = this.getAirPolutionParams(provinceName);
      const { data, status, statusText } = await axios.get(
        REALTIME_AIR_POLUTION_URL,
        { params },
      );
      const { header, body, pageNo } = data.response;
      // TODO: retry depending on pageNo
      if (header.resultCode !== '00')
        throw new HttpException(statusText, status);

      return this.formatAirPolution(body.items);
    } catch (error) {
      // TODO: send noti
    }
  }
  private getAirPolutionParams(sidoName: ProvinceName): Param4AirPolution {
    const serviceKey =
      'sqcYoxiPGJmWv+7+X1pPjExvgKbD5IhInUB7bJCtIQZ881DodxmENiH4r2FUHjL0F4cpDreKpxVIO/AeycV8Dw==';
    return {
      serviceKey,
      sidoName,
      searchCondition: 'HOUR',
      returnType: 'json',
      numOfRows: '100',
    };
  }

  private formatAirPolution(items): WeatherInfo[] {
    return items.map((item) => {
      const { cityName, sidoName, pm10Value, pm25Value, o3Value, dataTime } =
        item;
      return {
        cityName,
        provinceName: sidoName,
        pm10Value: pm10Value || -1,
        pm25Value: pm25Value || -1,
        o3Value: o3Value || -1,
        measuredAt: dayjs(dataTime).toDate(),
      };
    });
  }

  async upsertAirPolutionInfo(dto: WeatherInfo) {
    try {
      return await this.weatherRepo.save(dto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') return true;
    }
  }

  private async getNotUpdated() {
    for (const provinceName of PROVINCE_NAMES_SHORT) {
      const result = await this.weatherRepo.find({
        where: {
          provinceName,
          measuredAt: LessThanOrEqual(dayjs().subtract(1, 'hour').toDate()),
        },
        take: 10,
      });

      if (result.length > 0) return result;
    }
  }

  private async getNotExisting() {
    try {
      const promises = PROVINCE_NAMES_SHORT.map(async (provinceName) => {
        const count = await this.weatherRepo.count({ where: { provinceName } });

        if (!count) return provinceName;

        return;
      });
      const notCreated = await Promise.all(promises);
      return notCreated.filter((item) => item).pop();
    } catch (error) {
      console.log('WeathersService -> getNotExisting -> error', error);
    }
  }

  private async createWeather(provinceName: ProvinceName) {
    const cityLevelAirPolution = await this.getCityLevelAirPolution(
      provinceName,
    );
    const promises = cityLevelAirPolution.map(async (airPoultion) => {
      const weather = await this.getWeatherFromOpenWeather(
        airPoultion.cityName,
      );
      return await this.upsertAirPolutionInfo({ ...airPoultion, ...weather });
    });
    return await Promise.all(promises);
  }

  private async update(list: Weather[]) {
    const provinceName = list[0].provinceName as ProvinceName;
    const cityLevelAirPolution = await this.getCityLevelAirPolution(
      provinceName,
    );
    const promises = list.map(async (weather) => {
      try {
        const matchingAirPolution = cityLevelAirPolution.find(
          (airPoultion) => airPoultion.cityName === weather.cityName,
        );
        const weatherInfo = await this.getWeatherFromOpenWeather(
          matchingAirPolution.cityName,
        );
        const dto = {
          ...matchingAirPolution,
          ...weatherInfo,
        };
        return await this.weatherRepo.update(weather.id, dto);
      } catch (error) {
        if (parseInt(error.response.data.cod) === HttpStatus.NOT_FOUND) {
          weather.measuredAt = dayjs().toDate();
          await this.weatherRepo.save(weather);
        }
      }
    });
    return await Promise.all(promises);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async updateWeatherInfo() {
    this.logger.debug(
      `updateWeatherInfo started ${WeathersService.name} ${Date.now()}`,
    );
    try {
      const notExisting = (await this.getNotExisting()) as ProvinceName;
      if (notExisting) {
        await this.createWeather(notExisting);
        return;
      }

      const notUpdated = await this.getNotUpdated();

      if (!notUpdated) return;

      const result = await this.update(notUpdated);
      this.logger.debug(
        `updateWeatherInfo ended ${WeathersService.name} ${notUpdated.map(
          (item) => item.cityName,
        )} ${Date.now()}`,
      );
      return result;
    } catch (error) {
      // TODO handle not found error
    }
  }

  private async getAirPolutionList() {
    const promises = PROVINCE_NAMES_SHORT.map(
      async (provinceName: ProvinceName) =>
        await this.getCityLevelAirPolution(provinceName),
    );
    return await Promise.all(promises);
  }

  private async getWeatherFromOpenWeather(
    cityName: string,
  ): Promise<OpenWeather> {
    const OPEN_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
    const params = this.getOpenWeatherParams(cityName);
    const { data } = await axios.get(OPEN_WEATHER_URL, {
      params,
    });
    const { main, weather } = data;

    const description = weather[0].description;
    const feelsLike = Math.round(main.temp);
    const temp = Math.round(main.feels_like);
    const humidity = Math.round(main.humidity);
    return { description, feelsLike, temp, humidity };
  }

  private getOpenWeatherParams(cityName: string) {
    return {
      lang: 'kr',
      appid: '4a93d60067a3dd5f2f5790f9472a6bd0',
      q: cityName,
      units: 'metric',
    };
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
type Param4AirPolution = {
  serviceKey: string;
  sidoName: ProvinceName;
  searchCondition: string;
  returnType: string;
  numOfRows: string;
};
