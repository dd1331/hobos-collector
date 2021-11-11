import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenderRatio } from './entities/gender_ratio.entity';
import { ExcelsModule } from '../excels/excels.module';
import { CollectorsService } from './collectors.service';

@Module({
  imports: [TypeOrmModule.forFeature([GenderRatio]), ExcelsModule],
  providers: [CollectorsService],
})
export class CollectorsModule {}
