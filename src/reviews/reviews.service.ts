import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { LocalsService } from '../locals/locals.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    private readonly localsService: LocalsService,
  ) {}
  async create(dto: CreateReviewDto) {
    const local = await this.localsService.getLocalByCityCode(dto.cityCode);

    if (!local) throw new NotFoundException('지역정보가 존재하지 않습니다');

    const review = await this.reviewRepo.save({ ...dto, local });

    if (!review) throw new BadRequestException('리뷰 작성에 실패했습니다');

    return review;
  }

  findAll() {
    return `This action returns all reviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}