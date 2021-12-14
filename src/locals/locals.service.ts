import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { AdminDistrict } from '../districts/entities/admin_district.entity';
import { Weather } from '../weathers/entities/weather.entity';

@Injectable()
export class LocalsService {
  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepo: Repository<Weather>,
    @InjectRepository(AdminDistrict)
    private readonly adminDistrictRepo: Repository<AdminDistrict>,
  ) {}
  async getLocalRankingByCity(
    option: LocalRankingOption = { take: 9 },
  ): Promise<LocalRankingResult[]> {
    const { take } = option;
    const cities = await this.adminDistrictRepo.find({
      where: { townCode: IsNull(), cityCode: Not(IsNull()) },
      take,
    });

    const result: LocalRankingResult[] = [];
    const promises = cities.map(async (city) => {
      const weather = await this.weatherRepo.findOne({
        where: { cityName: city.cityName },
      });

      result.push({ ...city, ...weather });

      return city;
    });

    await Promise.all(promises);

    return result;
  }
}
type LocalRankingOption = {
  take: number;
};
type LocalRankingResult = AdminDistrict & {
  o3Value: number;
  pm10Value: number;
  pm25Value: number;
  description: string;
  temp: number;
  feelsLike: number;
  humidity: number;
};
