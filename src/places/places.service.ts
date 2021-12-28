import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import {
  LOCAL_NOT_FOUND_MESSAGE,
  PLACE_NOT_FOUND_MESSAGE,
} from '../constants/locals.constants';
import { LocalsService } from '../locals/locals.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Place } from '../places/entities/place.entity';
import axios from 'axios';
import { Local } from 'src/locals/entites/local.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FileEntity } from '../file.entity';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepo: Repository<Place>,
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>,
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
  async getCafeRanking(search: PlaceSearchOption) {
    const take = search.take || 8;
    const skip = search?.page ? (search?.page - 1) * take : 0;
    const { provinceName } = search;
    let where;
    if (provinceName) {
      const locals = await this.localsService.getLocalsByProvinceName(
        provinceName,
      );
      const localIds = locals.map((local) => local.id);
      where = { localId: In(localIds) };
    }
    return await this.placeRepo.find({
      where,
      take,
      skip,
      order: { title: 'DESC' },
      relations: ['files'],
    });
  }
  async getCafeDetail(id) {
    return await this.placeRepo.findOne({
      where: { id },
      relations: ['files'],
    });
  }
  async getCafe(id) {
    return await this.placeRepo.findOne(id);
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
  // @Cron(CronExpression.EVERY_10_SECONDS)
  private async createImageForPlace() {
    const places = await this.getPlacesMissingImage();
    const browser = await puppeteer.launch();
    const DO_AT_ONCE = 5;

    const promises = places
      .filter((t) => t)
      .slice(0, DO_AT_ONCE)
      .map(async (place) => {
        const cityName = place.address.split(' ')[1];
        const title = place.title.replace('<b>', '').replace('</b>', '');
        const MAX_THUMBNAIL_LIMIT = 4;
        try {
          const page = await browser.newPage();
          const selector =
            '#main_pack > section.sc_new.sp_nimage._prs_img._imageSearchPC > div > div.photo_group._listGrid > div.photo_tile._grid > div';
          const url = `https://search.naver.com/search.naver?where=image&sm=tab_jum&query=${cityName}+${title}`;

          await page.goto(url);

          const selected = await page.waitForSelector(selector);
          if (!selected) return;

          const imgElements = await page.$$(selector);

          for (const imgEliment of imgElements.slice(0, MAX_THUMBNAIL_LIMIT)) {
            const url = await this.getUrl(imgEliment);
            this.logger.debug(cityName + place.title, '장소 이미지 크롤링');
            await this.fileRepo.save({ url, place });
          }
        } catch (error) {
          await this.placeRepo.delete(place);
        }
      });

    await Promise.all(promises);

    await browser.close();
  }

  private async getUrl(imgEliment: puppeteer.ElementHandle<Element>) {
    const imgSelector = 'div.thumb > a > img';
    const url = await imgEliment.$eval(
      imgSelector,
      (element) => `${element.getAttribute('src')}`,
    );
    return url;
  }

  private async getPlacesMissingImage() {
    const places = await this.placeRepo.find();
    const getPlacesMissingImage = places.map(async (place) => {
      const existing = await this.fileRepo.findOne({
        where: { placeId: place.id },
      });
      if (existing) return;
      return place;
    });
    return await Promise.all(getPlacesMissingImage);
  }
}
type PlaceSearchOption = {
  take?: number;
  provinceName?: string;
  page: number;
};
