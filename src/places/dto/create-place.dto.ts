import { IsNotEmpty } from 'class-validator';
import {
  TITLE_IS_EMPTY_MESSAGE,
  ADDRESS_IS_EMPTY_MESSAGE,
  ROARDADDRESS_IS_EMPTY_MESSAGE,
  MAPX_IS_EMPTY_MESSAGE,
  MAPY_IS_EMPTY_MESSAGE,
} from '../../constants/locals.constants';

export class CreatePlaceDto {
  @IsNotEmpty({ message: TITLE_IS_EMPTY_MESSAGE })
  title: string;

  link: string;

  category: string;

  description: string;

  @IsNotEmpty({ message: ADDRESS_IS_EMPTY_MESSAGE })
  address: string;

  @IsNotEmpty({ message: ROARDADDRESS_IS_EMPTY_MESSAGE })
  roadAddress: string;

  @IsNotEmpty({ message: MAPX_IS_EMPTY_MESSAGE })
  mapx: string;

  @IsNotEmpty({ message: MAPY_IS_EMPTY_MESSAGE })
  mapy: string;
}
