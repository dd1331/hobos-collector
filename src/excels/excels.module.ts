import { Module } from '@nestjs/common';
import { ExcelsService } from './excels.service';

@Module({
  providers: [ExcelsService],
  exports: [ExcelsService],
})
export class ExcelsModule {}
