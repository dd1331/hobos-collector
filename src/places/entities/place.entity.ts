import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Local } from '../../locals/entites/local.entity';

@Entity()
export class Place {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  link: string;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column()
  roadAddress: string;

  @Column()
  mapx: string;

  @Column()
  mapy: string;
  @Column({ name: 'local_id', nullable: true })
  localId: number;

  @ManyToOne(() => Local, (local) => local.places)
  @JoinColumn({ name: 'local_id' })
  local: Local;
}
