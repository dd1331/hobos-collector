import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CollectorsService {
  async getAccessToken() {
    try {
      const url =
        'https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json';
      const { data } = await axios.get(url, {
        params: {
          consumer_key: 'e7a332fab6b248838d34',
          consumer_secret: 'ef3e914f5c67452f8826',
        },
      });
      return data;
    } catch (error) {
      console.log('ImpotersService -> import -> error', error);
    }
  }
  async getResidentInfo(params: GetResidentInfoDto) {
    const url =
      'https://sgisapi.kostat.go.kr/OpenAPI3/startupbiz/pplsummary.json';
    const { data } = await axios.get(url, { params });
    return data;
  }
}
type GetResidentInfoDto = { accessToken: string; adm_cd: string };
