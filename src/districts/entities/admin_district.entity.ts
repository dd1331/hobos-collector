import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  Index,
} from 'typeorm';
import { Weather } from '../../weathers/entities/weather.entity';

@Entity()
export class AdminDistrict {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'province_code', comment: '시/도' })
  provinceCode: string;

  @Index()
  @Column({ name: 'city_code', comment: '시/군/구', nullable: true })
  cityCode: string;

  @Column({
    name: 'town_code',
    comment: '읍/면/동',
    nullable: true,
  })
  townCode: string;

  @Column({ name: 'province_name' })
  provinceName: string;

  @Column({ name: 'city_name', nullable: true })
  cityName: string;

  @Column({ name: 'town_name', nullable: true })
  townName: string;
}
