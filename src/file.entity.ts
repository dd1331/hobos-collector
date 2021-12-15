import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Local } from './locals/entites/local.entity';

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Local, (local) => local.files)
  local: Local;
}
