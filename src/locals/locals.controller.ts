import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { LocalsService, LocalRankingOption } from './locals.service';

@Controller('locals')
export class LocalsController {
  constructor(private readonly localsService: LocalsService) {}
  @Get('ranking')
  getRanking(@Query() option: LocalRankingOption) {
    return this.localsService.getLocalRanking(option);
  }
  @Get(':cityCode')
  getLocalDetailBy(@Param('cityCode', ParseIntPipe) cityCode: number) {
    return this.localsService.getLocalDetail(cityCode);
  }
  @Get(':cityCode/neighbors')
  getLocalNeighbors(@Param('cityCode', ParseIntPipe) cityCode: number) {
    return this.localsService.getLocalNeighbors(cityCode);
  }
}
