import { Controller, Get, Query } from '@nestjs/common';
import { LocalsService } from './locals.service';

@Controller('locals')
export class LocalsController {
  constructor(private readonly localsService: LocalsService) {}
  @Get('ranking/city')
  getRanking(@Query() option) {
    return this.localsService.getLocalRankingByCity(option);
  }
}
