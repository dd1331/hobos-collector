import { Module } from '@nestjs/common';
import { LocalsService } from './locals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalsController } from './locals.controller';
import { Weather } from '../weathers/entities/weather.entity';
import { Local } from './entites/local.entity';
import { WeathersModule } from '../weathers/weathers.module';
import { FileEntity } from '../file.entity';
import { Place } from './entites/place.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Weather, Local, FileEntity, Place]),
    WeathersModule,
  ],
  providers: [LocalsService],
  controllers: [LocalsController],
  exports: [LocalsService],
})
export class LocalsModule {}
