import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull, getRepository } from 'typeorm';
import { Weather } from '../weathers/entities/weather.entity';
import axios from 'axios';
import { VISIT_KOREA_AREA_CODE_URL } from '../constants/public_data.constants';
import { FileEntity } from '../file.entity';
import { Local } from './entites/local.entity';

@Injectable()
export class LocalsService {
  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepo: Repository<Weather>,
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>,
    @InjectRepository(Local)
    private readonly localRepo: Repository<Local>,
  ) {}
  async getLocalRankingByCity(
    option: LocalRankingOption,
  ): Promise<LocalRankingResult[]> {
    const { take } = option;
    const cities = await this.localRepo.find({
      where: { townCode: IsNull(), cityCode: Not(IsNull()) },
      take: take || 9,
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
  async getLocalImagesFromVisitKorea(
    cityName: string,
  ): Promise<{ title: string; url: string }[]> {
    const local = await this.getLocalByCityName(cityName);
    const provinceList = await this.getProvinceList();
    const [matchingProvince] = provinceList.filter((province) => {
      return this.format4District(province.name) === local.provinceName;
    });

    const test3 = await this.getAreaCodeFromVisitKorea(matchingProvince.code);
    const url =
      'http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList';
    const params = {
      ServiceKey:
        'sqcYoxiPGJmWv+7+X1pPjExvgKbD5IhInUB7bJCtIQZ881DodxmENiH4r2FUHjL0F4cpDreKpxVIO/AeycV8Dw==',
      pageNo: 1,
      numOfRows: 10,
      MobileOS: 'IOS',
      MobileApp: 'hobos-local2',
      areaCode: matchingProvince.code,
      arrange: 'Q',
      listYN: 'Y',
      sigunguCode: 2,
      // contentTypeId: 12,
    };
    const result = await axios.get(url, { params });
    return result.data.response.body.items.item.map((i) => {
      return { title: i.title, url: i.firstimage };
    });
  }
  async getAreaCodeFromVisitKorea(
    areaCode?: number,
  ): Promise<{ code: number; name: string }[]> {
    const params = this.getParams4areaCode(areaCode);
    const { data } = await axios.get(VISIT_KOREA_AREA_CODE_URL, {
      params,
    });
    // TODO exception
    if (!data.response.body.items.item.length)
      return [{ code: -1, name: 'not found' }];
    const result = data.response.body.items.item.map((i) => {
      return { code: i.code, name: i.name };
    });
    return result;
  }
  private getParams4areaCode(areaCode?: number) {
    const ServiceKey =
      'sqcYoxiPGJmWv+7+X1pPjExvgKbD5IhInUB7bJCtIQZ881DodxmENiH4r2FUHjL0F4cpDreKpxVIO/AeycV8Dw==';

    const numOfRows = '100';
    const MobileOS = 'IOS';
    const MobileApp = 'hobos-local2';
    return { ServiceKey, numOfRows, MobileOS, MobileApp, areaCode };
  }
  async createImage4Local() {
    const provinceList = this.getProvinceList();
    const promises = provinceList.map(async (c) => {
      return await this.getAreaCodeFromVisitKorea(c.code);
    });
    const areaCodes = await Promise.all(promises);
    const promises2 = areaCodes.flat().map(async (city) => {
      const local = await this.getLocalByCityName(city.name);
      // // TODO exception 청원군 마산시 진해시 북제주군 남제주군
      if (local) {
        const image = await this.getLocalImagesFromVisitKorea(
          this.format4District(city.name),
        );
        const files = await this.fileRepo.save(image);
        local.files = files;

        await this.localRepo.save(local);

        return local;
      }
    });
    const result = await Promise.all(promises2);
    return result;
  }
  private getProvinceList() {
    return [
      { code: 1, name: '서울' },
      { code: 2, name: '인천' },
      { code: 3, name: '대전' },
      { code: 4, name: '대구' },
      { code: 5, name: '광주' },
      { code: 6, name: '부산' },
      { code: 7, name: '울산' },
      { code: 8, name: '세종특별자치시' },
      { code: 31, name: '경기도' },
      { code: 32, name: '강원도' },
      { code: 33, name: '충청북도' },
      { code: 34, name: '충청남도' },
      { code: 35, name: '경상북도' },
      { code: 36, name: '경상남도' },
      { code: 37, name: '전라북도' },
      { code: 38, name: '전라남도' },
      { code: 39, name: '제주도' },
    ];
  }
  private format4District(provinceName: string) {
    if (provinceName === '서울') return '서울특별시';
    if (provinceName === '인천') return '인천광역시';
    if (provinceName === '대전') return '대전광역시';
    if (provinceName === '대구') return '대구광역시';
    if (provinceName === '광주') return '광주광역시';
    if (provinceName === '부산') return '부산광역시';
    if (provinceName === '울산') return '울산광역시';
    if (provinceName === '제주도') return '제주특별자치도';
    return provinceName;
  }
  async createLocalData(data: LocalType[]) {
    const local = await this.localRepo.create(data);

    await this.localRepo.save(local);

    return local;
  }
  async getCityList() {
    return await this.localRepo.find({ where: { townCode: IsNull() } });
  }
  async getCityNamesByProvinceName(name: string) {
    const provinceName = this.formatProvinceNameLong(name);
    return await getRepository(Local)
      .createQueryBuilder('Local')
      .select('city_name AS cityName')
      .addSelect('province_name AS provinceName')
      .where('province_name = :provinceName', { provinceName })
      .andWhere('city_name IS NOT NULL')
      .andWhere('province_name IS NOT NULL')
      .groupBy('city_name')
      .getRawMany();
  }
  async getLocalDetail(cityCode: number) {
    const local = await this.localRepo.findOne({ where: { cityCode } });
    return local;
  }

  async getLocalByProvinceName(provinceName: string) {
    return await this.localRepo.findOne({ where: { provinceName } });
  }
  async getLocalByCityName(originalCityName: string) {
    const cityName =
      originalCityName === '세종시' ? '세종특별자치시' : originalCityName;
    return await this.localRepo.findOne({
      where: { cityName, townCode: IsNull() },
    });
  }
  async getLocalByCityCode(cityCode: string) {
    return await this.localRepo.findOne({ cityCode });
  }
  private formatProvinceNameLong(name) {
    if (name === '서울') return '서울특별시';
    if (name === '부산') return '부산광역시';
    if (name === '인천') return '인천광역시';
    if (name === '대구') return '대구광역시';
    if (name === '광주') return '광주광역시';
    if (name === '대전') return '대전광역시';
    if (name === '울산') return '울산광역시';
    if (name === '세종') return '세종특별자치시';
    if (name === '경기') return '경기도';
    if (name === '강원') return '강원도';
    if (name === '충북') return '충청북도';
    if (name === '충남') return '충청남도';
    if (name === '전북') return '전라북도';
    if (name === '전남') return '전라남도';
    if (name === '경북') return '경상북도';
    if (name === '경남') return '경상남도';
    if (name === '제주') return '제주특별자치도';
  }
}
type LocalRankingOption = {
  take: number;
};
type LocalRankingResult = Local & {
  o3Value: number;
  pm10Value: number;
  pm25Value: number;
  description: string;
  temp: number;
  feelsLike: number;
  humidity: number;
};
type LocalType = {
  provinceCode: string;
  province: string;
  cityCode: string;
  cityName: string;
  townCode: string;
  townName: string;
};
