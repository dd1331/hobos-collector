import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GenderRatio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  provinceCode: string;

  @Column()
  provinceName: string;

  @Column()
  femaleRatio: string;

  @Column()
  maleRatio: string;

  @Column()
  femalePopulation: string;

  @Column()
  malePopulation: string;

  @Column()
  totalPopulation: string;
}
