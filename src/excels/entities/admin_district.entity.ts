import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AdminDistrict {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  provinceCode: string;

  @Column()
  cityCode: string;

  @Column({ nullable: true })
  townCode: string;

  @Column()
  province: string;

  @Column()
  cityName: string;

  @Column({ nullable: true })
  townName: string;
}
