import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExcelsModule } from './excels/excels.module';
import { CollectorsModule } from './collectors/collectors.module';
import { GenderRatio } from './collectors/entities/gender_ratio.entity';
import { DistrictsModule } from './districts/districts.module';
import { AdminDistrict } from './districts/entities/admin_district.entity';
import { WeathersModule } from './weathers/weathers.module';
import { Weather } from './weathers/entities/weather.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Weather, AdminDistrict, GenderRatio],
      synchronize: true,
      // dropSchema: true,
    }),
    ExcelsModule,
    CollectorsModule,
    DistrictsModule,
    WeathersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
