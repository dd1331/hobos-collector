import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminDistrict } from './excels/entities/admin_district.entity';
import { ExcelsModule } from './excels/excels.module';
import { CollectorsModule } from './collectors/collectors.module';
import { GenderRatio } from './collectors/entities/gender_ratio.entity';
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
      entities: [AdminDistrict, GenderRatio],
      synchronize: true,
    }),
    ExcelsModule,
    CollectorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
