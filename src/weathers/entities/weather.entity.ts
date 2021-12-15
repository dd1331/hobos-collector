import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AdminDistrict } from '../../districts/entities/admin_district.entity';

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'province_name' })
  provinceName: string;

  @Column({ name: 'city_name', unique: true })
  cityName: string;

  @Column({ name: 'measured_at' })
  measuredAt: Date;

  @Column({ name: 'o3_value', nullable: true })
  o3Value: number;

  @Column({ name: 'pm10_value', nullable: true })
  pm10Value: number;

  @Column({ name: 'pm25_value', nullable: true })
  pm25Value: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  temp: number;

  @Column({ name: 'feels_like', nullable: true })
  feelsLike: number;

  @Column({ nullable: true })
  humidity: number;
}
