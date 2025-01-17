import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Column,
  Index,
} from 'typeorm';
import { Weather } from '../../weathers/entities/weather.entity';
import { FileEntity } from '../../file.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Place } from '../../places/entities/place.entity';

@Entity()
export class Local {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'province_code', comment: '시/도' })
  provinceCode: string;

  @Index()
  @Column({ name: 'city_code', comment: '시/군/구', nullable: true })
  cityCode: string;

  @Column({
    name: 'town_code',
    comment: '읍/면/동',
    nullable: true,
  })
  townCode: string;

  @Column({ name: 'province_name' })
  provinceName: string;

  @Column({ name: 'city_name', nullable: true })
  cityName: string;

  @Column({ name: 'town_name', nullable: true })
  townName: string;

  @OneToOne(() => Weather)
  @JoinColumn()
  weather: Weather;

  @OneToMany(() => FileEntity, (file) => file.local)
  files: FileEntity[];

  @OneToMany(() => Review, (review) => review.local)
  reviews: Review[];

  @OneToMany(() => Place, (place) => place.local)
  places: Place[];
}
