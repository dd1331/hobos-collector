import { Injectable } from '@nestjs/common';
import { AdminDistrict } from '../districts/entities/admin_district.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
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
    const adminDistrict = this.adminDistrictRepo.create(data);
    const result = await this.adminDistrictRepo.save(adminDistrict);

    return result;
  }
  async getAdminDistrictList() {
    return await getRepository(AdminDistrict)
      .createQueryBuilder('adminDistrict')
      .select('cityCode')
      .groupBy('cityCode')
      .getRawMany();
  }
  async getCityNames() {
    return await getRepository(AdminDistrict)
      .createQueryBuilder('adminDistrict')
      .select('cityName')
      .groupBy('cityName')
      .getRawMany();
  }
}
