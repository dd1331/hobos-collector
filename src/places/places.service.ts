import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import {
  LOCAL_NOT_FOUND_MESSAGE,
  PLACE_NOT_FOUND_MESSAGE,
} from '../constants/locals.constants';
import { LocalsService } from '../locals/locals.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from '../places/entities/place.entity';
import axios from 'axios';
import { Local } from 'src/locals/entites/local.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepo: Repository<Place>,
    private readonly localsService: LocalsService,
  ) {}
  private readonly logger = new Logger(PlacesService.name);
  async createPlace(place: CreatePlaceDto) {
    const cityName = place.address.split(' ')[1];
    const local = await this.localsService.getLocalByCityName(cityName);

    if (!local) throw new NotFoundException(LOCAL_NOT_FOUND_MESSAGE);

    return await this.placeRepo.save({ ...place, local });
  }
  async updatePlace(dto: UpdatePlaceDto) {
    const { id, description } = dto;
    const place = await this.placeRepo.findOne(id);

    if (!place) throw new NotFoundException(PLACE_NOT_FOUND_MESSAGE);

    return await this.placeRepo.save({ ...place, description });
  }
  private async getPlaceInfoFromNaver(
    query: string,
  ): Promise<CreatePlaceDto[]> {
    try {
      const url = 'https://openapi.naver.com/v1/search/local.json';
      const params = {
        query,
        display: 5,
        sort: 'comment',
      };
      const headers = {
        'X-Naver-Client-Id': '4yYQ9GQnL3sH0JOpPXpS',
        'X-Naver-Client-Secret': 'pYzHZT10jJ',
      };
      const { data } = await axios.get(url, { params, headers });
      return data.items;
    } catch (error) {
      console.log('PlacesService -> error', error);
    }
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  private async createSeedPlaceData(category = '카페') {
    try {
      const locals = await this.localsService.getCityList();
      const localsMissingPlace = await this.getLocalsMissingPlace(locals);

      const REQUEST_LIMIT_EVERY_10_SECONDS = 10;
      const promises = localsMissingPlace
        .filter((local) => local)
        .slice(0, REQUEST_LIMIT_EVERY_10_SECONDS)
        .map(async (local) => await this.createPlaceByAdmin(local, category));
      return await Promise.all(promises);
    } catch (error) {
      console.log('PlacesService -> createSeedPlaceData -> error', error);
    }
  }

  private async getLocalsMissingPlace(locals: Local[]) {
    const localsMissingPlace = locals.map(async (local) => {
      const place = await this.placeRepo.findOne({
        where: { localId: local.id },
      });
      if (place) return;
      return local;
    });
    return await Promise.all(localsMissingPlace);
  }

  private async createPlaceByAdmin(local: Local, category: string) {
    this.logger.debug(local.cityName, category);
    const query = `${local.cityName} ${category}`;
    const placeDtos = await this.getPlaceInfoFromNaver(query);
    const places = placeDtos.map(async (placeInfo) => {
      return await this.placeRepo.save({ ...placeInfo, local });
    });
    await Promise.all(places);
  }
}
