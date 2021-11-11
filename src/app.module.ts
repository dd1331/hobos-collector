import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminDistrict } from './excels/entities/admin_district.entity';
import { ExcelsModule } from './excels/excels.module';
import { CollectorsModule } from './collectors/collectors.module';
import { GenderRatio } from './collectors/entities/gender_ratio.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'charlie',
      password: '1331',
      database: 'hobos_test',
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
