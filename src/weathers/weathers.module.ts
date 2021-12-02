import { Module } from '@nestjs/common';
import { WeathersService } from './weathers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather } from './entities/weather.entity';
import { DistrictsModule } from '../districts/districts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Weather]), DistrictsModule],
  providers: [WeathersService],
})
export class WeathersModule {}
