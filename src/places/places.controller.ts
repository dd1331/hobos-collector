import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post('place')
  createPlace(@Body(ValidationPipe) dto: CreatePlaceDto) {
    return this.placesService.createPlace(dto);
  }
  @Get('cafe/ranking')
  getCafeRanking(@Query() dto) {
    return this.placesService.getCafeRanking(dto);
  }
  @Get('cafe/:cafeCode')
  getCafeDetail(@Param('cafeCode', ParseIntPipe) cafeCode: number) {
    return this.placesService.getCafeDetail(cafeCode);
  }
}
