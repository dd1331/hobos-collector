import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { AdminDistrict } from '../../districts/entities/admin_district.entity';
import { Weather } from '../../weathers/entities/weather.entity';
import { FileEntity } from 'src/file.entity';

@Entity()
export class Local {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => AdminDistrict)
  @JoinColumn()
  adminDistrict: AdminDistrict;

  @OneToOne(() => Weather)
  @JoinColumn()
  weather: Weather;

  @OneToMany(() => FileEntity, (file) => file.local)
  files: FileEntity[];
}
