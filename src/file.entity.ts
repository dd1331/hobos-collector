import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Local } from './locals/entites/local.entity';
import { Place } from './places/entities/place.entity';

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(() => Local, (local) => local.files)
  local: Local;

  @Column({ name: 'place_id' })
  placeId: number;

  @ManyToOne(() => Place, (place) => place.files)
  @JoinColumn({ name: 'place_id' })
  place: Place;
}
