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
  city: string;

  @Column({ nullable: true })
  town: string;
}
