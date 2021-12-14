import { Module } from '@nestjs/common';
import { LocalsService } from './locals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalsController } from './locals.controller';
import { Weather } from '../weathers/entities/weather.entity';
import { AdminDistrict } from '../districts/entities/admin_district.entity';
import { DistrictsModule } from '../districts/districts.module';
import { WeathersModule } from '../weathers/weathers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminDistrict, Weather]),
    DistrictsModule,
    WeathersModule,
  ],
  providers: [LocalsService],
  controllers: [LocalsController],
})
export class LocalsModule {}
