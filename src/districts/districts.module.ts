import { Module } from '@nestjs/common';
import { AdminDistrict } from './entities/admin_district.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictsService } from './districts.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminDistrict])],
  providers: [DistrictsService],
  exports: [DistrictsService],
})
export class DistrictsModule {}
