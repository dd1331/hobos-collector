import { Injectable } from '@nestjs/common';
import { AdminDistrict } from '../districts/entities/admin_district.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, IsNull } from 'typeorm';
type AdminDistrictType = {
  provinceCode: string;
  province: string;
  cityCode: string;
  cityName: string;
  townCode: string;
  townName: string;
};
@Injectable()
export class DistrictsService {
  constructor(
    @InjectRepository(AdminDistrict)
    private readonly adminDistrictRepo: Repository<AdminDistrict>,
  ) {}
  async createAdminDistrictData(data: AdminDistrictType[]) {
    const result = await this.adminDistrictRepo.save(data);

    return result;
  }
  async getCityList() {
    return await this.adminDistrictRepo.find({ where: { townCode: IsNull() } });
  }
  async getCityNamesByProvinceName(name: string) {
    const provinceName = this.formatProvinceNameLong(name);
    return await getRepository(AdminDistrict)
      .createQueryBuilder('adminDistrict')
      .select('city_name AS cityName')
      .addSelect('province_name AS provinceName')
      .where('province_name = :provinceName', { provinceName })
      .andWhere('city_name IS NOT NULL')
      .andWhere('province_name IS NOT NULL')
      .groupBy('city_name')
      .getRawMany();
  }

  async getAdminDistrictByProvinceName(provinceName: string) {
    return await this.adminDistrictRepo.findOne({ where: { provinceName } });
  }

  async getCityListByCityName(originalCityName: string) {
    const cityName =
      originalCityName === '세종시' ? '세종특별자치시' : originalCityName;
    return await this.adminDistrictRepo.findOne({
      where: { cityName, townCode: '' },
    });
  }

  formatProvinceNameLong(name) {
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
