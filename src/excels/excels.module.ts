import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDistrict } from './entities/admin_district.entity';
import { ExcelsService } from './excels.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminDistrict])],
  providers: [ExcelsService],
})
export class ExcelsModule {}
