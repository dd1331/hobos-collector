import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectorsService } from './collectors/collectors.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CollectorsService],
})
export class AppModule {}
