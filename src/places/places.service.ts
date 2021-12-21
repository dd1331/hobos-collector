import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepo: Repository<Place>,
    private readonly localsService: LocalsService,
  ) {}
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
}
