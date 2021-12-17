import { IsNotEmpty } from 'class-validator';
export class CreateReviewDto {
  @IsNotEmpty({ message: 'userId 값이 존재하지 없습니다' })
  userId: number;

  @IsNotEmpty({ message: 'content 값이 존재하지 않습니다' })
  content: string;

  @IsNotEmpty({ message: 'cityCode 값이 존재하지 않습니다' })
  cityCode: string;
}
