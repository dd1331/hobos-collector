import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectorsService } from './collectors/collectors.service';
import { AdminDistrict } from './excels/entities/admin_district.entity';
import { ExcelsModule } from './excels/excels.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'charlie',
      password: '1331',
      database: 'hobos_test',
      entities: [AdminDistrict],
      synchronize: true,
    }),
    ExcelsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CollectorsService],
})
export class AppModule {}
