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
import { PlacesService } from '../places/places.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    private readonly localsService: LocalsService,
    private readonly placesService: PlacesService,
  ) {}
  async create(dto: CreateReviewDto) {
    const review = this.reviewRepo.create(dto);
    if (dto.type === 'local') {
      const local = await this.localsService.getLocalByCityCode(dto.code);

      if (!local) throw new NotFoundException('지역정보가 존재하지 않습니다');

      review.local = local;
    }
    if (dto.type === 'cafe') {
      const cafe = await this.placesService.getCafe(dto.code);

      if (!cafe) throw new NotFoundException('장소정보가 존재하지 않습니다');

      review.place = cafe;
    }
    const result = await this.reviewRepo.save(review);

    if (!result) throw new BadRequestException('리뷰 작성에 실패했습니다');

    return result;
  }

  async getReviews(code, type) {
    let where = {};
    if (type === 'local') {
      const local = await this.localsService.getLocalByCityCode(code);
      where = { localId: local.id };
    }
    if (type === 'cafe') {
      const cafe = await this.placesService.getCafeDetail(code);
      where = { placeId: cafe.id };
    }
    console.log('ReviewsService -> getReviews -> where', where);
    console.log(
      'ReviewsService -> getReviews -> where',
      await this.reviewRepo.find({
        order: { createdAt: 'DESC' },
        where,
      }),
    );
    return this.reviewRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
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
