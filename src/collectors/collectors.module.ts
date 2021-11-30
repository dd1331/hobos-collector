import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenderRatio } from './entities/gender_ratio.entity';
import { ExcelsModule } from '../excels/excels.module';
import { CollectorsService } from './collectors.service';
import { DistrictsModule } from '../districts/districts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GenderRatio]),
    ExcelsModule,
    DistrictsModule,
  ],
  providers: [CollectorsService],
})
export class CollectorsModule {}
