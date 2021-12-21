import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post('place')
  createPlace(@Body(ValidationPipe) dto: CreatePlaceDto) {
    return this.placesService.createPlace(dto);
  }
}
