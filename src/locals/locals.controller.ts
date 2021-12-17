import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { LocalsService } from './locals.service';

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
}
