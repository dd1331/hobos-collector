import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AdminDistrict {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'province_code', comment: '시/도' })
  provinceCode: string;

  @Column({ name: 'city_code', comment: '시/군/구' })
  cityCode: string;

  @Column({ name: 'town_code', comment: '읍/면/동', nullable: true })
  townCode: string;

  @Column({ name: 'province_name' })
  provinceName: string;

  @Column({ name: 'city_name' })
  cityName: string;

  @Column({ name: 'town_name', nullable: true })
  townName: string;
}
