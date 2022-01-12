import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Local } from '../../locals/entites/local.entity';
import { FileEntity } from '../../file.entity';

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

  @OneToMany(() => FileEntity, (file) => file.place)
  files: FileEntity[];

  @OneToMany(() => Place, (review) => review.places)
  places: Place[];
}
