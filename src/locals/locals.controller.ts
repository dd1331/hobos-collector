import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Post,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { LocalsService } from './locals.service';
import { CreatePlaceDto } from './dto/create-place.dto';

@Controller('locals')
export class LocalsController {
  constructor(private readonly localsService: LocalsService) {}
  @Get('ranking/city')
  getRanking(@Query() option) {
    return this.localsService.getLocalRankingByCity(option);
  }
  @Get(':cityCode')
  getLocalDetailBy(@Param('cityCode', ParseIntPipe) cityCode: number) {
    return this.localsService.getLocalDetail(cityCode);
  }
  @Post('place')
  createPlace(@Body(ValidationPipe) dto: CreatePlaceDto) {
    return this.localsService.createPlace(dto);
  }
}
