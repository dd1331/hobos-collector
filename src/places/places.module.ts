import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from '../places/entities/place.entity';
import { LocalsModule } from '../locals/locals.module';
import { FileEntity } from '../file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Place, FileEntity]), LocalsModule],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
