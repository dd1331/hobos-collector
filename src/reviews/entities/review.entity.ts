import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { Local } from '../../locals/entites/local.entity';
import { Place } from '../../places/entities/place.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  content: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt: Date;

  @Column({ name: 'local_id', nullable: true })
  localId: number;

  @Column({ name: 'place_id', nullable: true })
  placeId: number;

  @ManyToOne(() => Local, (local) => local.reviews)
  @JoinColumn({ name: 'local_id' })
  local: Local;

  @ManyToOne(() => Place, (place) => place.places)
  @JoinColumn({ name: 'place_id' })
  place: Place;
}
