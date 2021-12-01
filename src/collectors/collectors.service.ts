import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenderRatio } from './entities/gender_ratio.entity';
import { DistrictsService } from '../districts/districts.service';

@Injectable()
export class CollectorsService {
  constructor(
    @InjectRepository(GenderRatio)
    private readonly genderRatioRepo: Repository<GenderRatio>,
    private readonly districService: DistrictsService,
  ) {}
  async getAccessToken() {
    try {
      const url =
        'https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json';
      const { data } = await axios.get(url, {
        params: {
          consumer_key: 'fb83e5e89e634c03aa1d',
          consumer_secret: '970cce8f7ab744ab9b58',
        },
      });
      return data;
    } catch (error) {
      console.log('ImpotersService -> import -> error', error);
    }
  }
  async getResidentInfo(params: ResidentInfoDto) {
    const url =
      'https://sgisapi.kostat.go.kr/OpenAPI3/startupbiz/pplsummary.json';
    const { data } = await axios.get(url, { params });
    return data;
  }
  async getGenderRatio(params: GenderRatioDto) {
    const url =
      'https://sgisapi.kostat.go.kr/OpenAPI3/startupbiz/mfratiosummary.json';
    const { data } = await axios.get(url, { params });
    return data;
  }
  async getGenderRatioList(params: GenderRatioListDto) {
    const { accessToken, admCdList } = params;
    const promises = admCdList.map((adm_cd) =>
      this.getGenderRatio({ accessToken, adm_cd }),
    );
    const genderRatioList = await Promise.all(promises);
    return genderRatioList.map((genderRatio) => genderRatio.result[0]);
  }
  async createGenderRatioData(accessToken: string) {
    const adminDistrictList = await this.districService.getAdminDistrictList();
    const admCdList = adminDistrictList.map((ad) => ad.cityCode);
    const genderRatioList = await this.getGenderRatioList({
      accessToken,
      admCdList,
    });
    const promises = genderRatioList.map(async (genderRatio) => {
      const genderRatioDto = this.getGenderRatioDto(genderRatio);
      const created = this.genderRatioRepo.create(genderRatioDto);
      return this.genderRatioRepo.save(created);
    });
    return await Promise.all(promises);
  }
  private getGenderRatioDto(genderRatio) {
    return {
      provinceCode: genderRatio.adm_cd,
      provinceName: genderRatio.adm_nm,
      femaleRatio: genderRatio.f_per,
      maleRatio: genderRatio.m_per,
      femalePopulation: genderRatio.f_ppl,
      malePopulation: genderRatio.m_ppl,
      totalPopulation: genderRatio.total_ppl,
    };
  }
}
type GenderRatioDto = ResidentInfoDto;
type GenderRatioListDto = { accessToken: string; admCdList: string[] };
type ResidentInfoDto = { accessToken: string; adm_cd: string };
