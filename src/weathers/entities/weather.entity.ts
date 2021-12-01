import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'city_name' })
  cityName: string;

  @Column({ name: 'measured_at' })
  measuredAt: Date;

  @Column({ name: 'o3_value', nullable: true })
  o3Value: number;

  @Column({ name: 'pm10_value', nullable: true })
  pm10Value: number;

  @Column({ name: 'pm25_value', nullable: true })
  pm25Value: number;
}
