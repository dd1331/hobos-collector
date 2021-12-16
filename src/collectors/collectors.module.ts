import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenderRatio } from './entities/gender_ratio.entity';
import { ExcelsModule } from '../excels/excels.module';
import { CollectorsService } from './collectors.service';
import { LocalsModule } from '../locals/locals.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GenderRatio]),
    ExcelsModule,
    LocalsModule,
  ],
  providers: [CollectorsService],
})
export class CollectorsModule {}
