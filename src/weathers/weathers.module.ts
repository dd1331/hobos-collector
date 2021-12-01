import { Module } from '@nestjs/common';
import { WeathersService } from './weathers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather } from './entities/weather.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Weather])],
  providers: [WeathersService],
  exports: [WeathersService],
})
export class WeathersModule {}
