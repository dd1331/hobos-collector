import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @UsePipes(ValidationPipe)
  @Get('local/:cityCode')
  getLocalReviews(@Param('cityCode', ParseIntPipe) cityCode) {
    return this.reviewsService.getReviews(cityCode, 'local');
  }

  @UsePipes(ValidationPipe)
  @Get('cafe/:cafeCode')
  getCafeReviews(@Param('cafeCode', ParseIntPipe) cafeCode) {
    return this.reviewsService.getReviews(cafeCode, 'cafe');
  }

  @Delete(':id')
  removeLocalReview(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.remove(id);
  }
}
